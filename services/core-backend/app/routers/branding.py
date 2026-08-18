# Location: services/core-backend/app/routers/branding.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import dns.resolver
from app.db.session import get_db_session
from app.models.branding import TenantCustomDomain

router = APIRouter(prefix="/api/v1/branding/domains")

async def flush_domain_to_cache(domain, inst_id, branch_id):
    # Mocking Redis flush
    pass

@router.post("/verify")
async def verify_dns_domain(
    domain_id: str,
    db: AsyncSession = Depends(get_db_session)
):
    # 1. Fetch domain record from database
    stmt = select(TenantCustomDomain).where(TenantCustomDomain.id == domain_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Domain registration record not found in system directories."
        )
        
    expected_token = f"aimantiss-verification-token={record.verification_token}"
    target_domain = record.custom_domain
    
    try:
        # 2. Query target domain TXT records using dnspython
        resolver = dns.resolver.Resolver()
        resolver.timeout = 5.0
        resolver.lifetime = 5.0
        
        txt_answers = resolver.resolve(target_domain, "TXT")
        verified = False
        
        for rdata in txt_answers:
            for txt_string in rdata.strings:
                if txt_string.decode("utf-8") == expected_token:
                    verified = True
                    break
            if verified:
                break
                
        if not verified:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Verification failed. TXT record containing '{expected_token}' not identified."
            )
            
        # 3. Update verification state in database on successful verification
        import datetime
        record.is_verified = True
        record.verified_at = datetime.datetime.now(datetime.timezone.utc)
        await db.commit()
        
        # Flush key into dynamic Redis lookup table
        await flush_domain_to_cache(target_domain, record.institution_id, record.branch_id)
        
        return {"status": "success", "message": f"Domain '{target_domain}' successfully claimed."}
        
    except dns.resolver.NoAnswer:
        raise HTTPException(status_code=400, detail="No TXT records found on target domain.")
    except dns.exception.Timeout:
        raise HTTPException(status_code=504, detail="DNS lookup timeout. Verify nameserver connectivity.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal verification error: {str(e)}")
