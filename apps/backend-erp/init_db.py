from src.db.database import SessionLocal, engine
from src.db.models import Base, User, Tenant, Branch
from src.core.security import get_password_hash

def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    hq = Tenant(institution_code="suffat-hq", name="Suffat HQ")
    suffat = Tenant(institution_code="suffat", name="Suffat Academy")
    db.add(hq)
    db.add(suffat)
    db.commit()
    
    hq_main = Branch(tenant_id=hq.id, branch_code="main", name="HQ Main")
    suffat_main = Branch(tenant_id=suffat.id, branch_code="main", name="Suffat Main")
    db.add(hq_main)
    db.add(suffat_main)
    db.commit()
    
    users = [
        User(email="admin@suffat.org", hashed_password=get_password_hash("password123"), role="SUPER_ADMIN", tenant_id=hq.id, branch_id=hq_main.id),
        User(email="admin_aa59cbc5f3@suffat.com", hashed_password=get_password_hash("password123"), role="CENTER_ADMIN", tenant_id=suffat.id, branch_id=suffat_main.id),
        User(email="manager@suffat.com", hashed_password=get_password_hash("password123"), role="NAZIM", tenant_id=suffat.id, branch_id=suffat_main.id),
        User(email="usthad_51c88a81db@suffat.com", hashed_password=get_password_hash("password123"), role="USTAD", tenant_id=suffat.id, branch_id=suffat_main.id)
    ]
    
    db.add_all(users)
    db.commit()
    db.close()
    print("Database seeded successfully with test credentials.")

if __name__ == "__main__":
    init_db()
