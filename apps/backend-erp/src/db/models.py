from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(Integer, primary_key=True, index=True)
    institution_code = Column(String, unique=True, index=True)
    name = Column(String)

class Branch(Base):
    __tablename__ = "branches"
    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    branch_code = Column(String, index=True)
    name = Column(String)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # SUPER_ADMIN, CENTER_ADMIN, NAZIM, USTAD, STUDENT, PARENT
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)
