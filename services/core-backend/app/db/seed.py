import os
import sys
from hashlib import sha256
from app.db.session import SessionLocal
from app.models.tenant import Institution, Branch
from app.models.identity import User, UserSession
from app.models.rbac import Role, Permission, RolePermissionBridge, UserRoleAssignment
from app.core.security import get_password_hash

def bootstrap_system():
    print("Initializing Database Seed Operations...")
    db = SessionLocal()
    
    try:
        if db.query(Institution).first():
            print("System already seeded. Aborting to protect active production data.")
            sys.exit(0)
            
        permissions_list = [
            "academic:syllabus:create", "academic:syllabus:read", 
            "academic:syllabus:update", "academic:syllabus:delete",
            "student:profile:create", "student:profile:read", 
            "student:profile:update", "student:profile:delete",
            "billing:invoice:create", "billing:invoice:read", 
            "billing:invoice:update", "billing:invoice:delete",
            "system:tenant:provision", "system:audit:read"
        ]
        
        inserted_permissions = {}
        for perm_code in permissions_list:
            p = Permission(code=perm_code, description=f"Grants rights to perform {perm_code.split(':')[-1]} on {perm_code.split(':')[1]} resources.")
            db.add(p)
            inserted_permissions[perm_code] = p
            
        db.flush()
        
        inst = Institution(
            code="SUH01",
            name="Suffat-ul Huffaz National HQ"
        )
        db.add(inst)
        db.flush()
        
        branch = Branch(
            institution_id=inst.id,
            code="MN01",
            name="Main Campus"
        )
        db.add(branch)
        db.flush()
        
        owner_role = Role(
            institution_id=inst.id,
            name="System Owner",
            description="Universal root administrative privileges across national systems."
        )
        db.add(owner_role)
        db.flush()
        
        for perm in db.query(Permission).all():
            bridge = RolePermissionBridge(role_id=owner_role.id, permission_id=perm.id)
            db.add(bridge)
            
        admin_email = os.environ.get("SUPER_ADMIN_EMAIL", "admin@suffat.org")
        admin_pass = os.environ.get("SUPER_ADMIN_PASSWORD", "SuperSecure99##")
        
        admin_user = User(
            email=admin_email,
            password_hash=get_password_hash(admin_pass),
            full_name="Root System Controller",
            is_verified=True,
            is_active=True
        )
        db.add(admin_user)
        db.flush()
        
        assignment = UserRoleAssignment(
            user_id=admin_user.id,
            institution_id=inst.id,
            branch_id=branch.id,
            role_id=owner_role.id
        )
        db.add(assignment)
        
        db.commit()
        print("Database Seed Operations Successfully Completed!")
        
    except Exception as e:
        db.rollback()
        print(f"CRITICAL FAULT during Bootstrap: {str(e)}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    bootstrap_system()
