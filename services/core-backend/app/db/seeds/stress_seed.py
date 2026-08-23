import asyncio
import uuid
import random
import sys
from datetime import datetime, timedelta, date
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

# Setup DB connection
DATABASE_URL = "postgresql+asyncpg://suffat_admin:suffat_password@localhost:5432/suffat_erp"
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

fake = Faker('en_IN')

# Models
from app.models.tenant import Institution, Branch
from app.models.academic import Course
from app.models.identity import User
from app.models.rbac import Role, UserRoleAssignment
from app.models.staff import StaffProfile
from app.models.student import AcademicYear, Batch, StudentProfile, StudentEnrollment
from app.models.academics import SabaqRecord, PrayerAttendance, BehaviorLog
from app.models.portal import Complaint, ComplaintTargetType, ComplaintRecipientType
from app.core.security import hash_password

async def seed_massive_data():
    async with async_session() as db:
        print("Starting Massive Scale Simulation Seed...")
        
        inst = (await db.execute(select(Institution).where(Institution.code == 'SUF'))).scalar_one_or_none()
        if not inst:
            print("Institution SUF not found.")
            return

        role_admin = (await db.execute(select(Role).where(Role.name == "Center Admin"))).scalar_one_or_none()
        role_ustad = (await db.execute(select(Role).where(Role.name == "Usthad"))).scalar_one_or_none()
        role_student = (await db.execute(select(Role).where(Role.name == "Student"))).scalar_one_or_none()

        if not all([role_admin, role_ustad, role_student]):
            print("Missing essential Roles. Ensure full_seed.py was run.")
            return

        hashed_pw = hash_password("1234")

        # 1. Create 10 Branches
        branches_data = [
            ("KL", "Kerala", "Ernakulam"), ("KL", "Kerala", "Malappuram"), ("KL", "Kerala", "Kozhikode"),
            ("TN", "Tamil Nadu", "Chennai"), ("TN", "Tamil Nadu", "Coimbatore"), ("TN", "Tamil Nadu", "Madurai"),
            ("HR", "Haryana", "Gurugram"), ("HR", "Haryana", "Faridabad"), ("HR", "Haryana", "Panipat"),
            ("UP", "Uttar Pradesh", "Lucknow")
        ]
        
        branch_objs = []
        for state_code, state, district in branches_data:
            br_id = uuid.uuid4()
            br = Branch(
                id=br_id,
                institution_id=inst.id,
                code=f"BR-{state_code}-{uuid.uuid4().hex[:6].upper()}",
                name=f"Suffat {district} Center"
            )
            db.add(br)
            branch_objs.append(br)
        await db.commit()
        print(f"Created {len(branch_objs)} branches.")

        # 2. Create or get Academic Year
        ay = (await db.execute(select(AcademicYear).where(AcademicYear.name == '2026-2027'))).scalar_one_or_none()
        if not ay:
            ay_id = uuid.uuid4()
            ay = AcademicYear(
                id=ay_id,
                institution_id=inst.id,
                name="2026-2027",
                start_date=date(2026, 4, 1),
                end_date=date(2027, 3, 31),
                is_active=True
            )
            db.add(ay)
            await db.commit()
        
        # Course
        c = (await db.execute(select(Course).where(Course.name == 'Hifz Ul Quran'))).scalar_one_or_none()
        if not c:
            mock_course_id = uuid.uuid4()
            c = Course(id=mock_course_id, branch_id=branch_objs[0].id, code="HIFZ01", name="Hifz Ul Quran", duration_months=36)
            db.add(c)
            await db.commit()
        mock_course_id = c.id

        # Generate data arrays for bulk insert
        users_to_insert = []
        staff_to_insert = []
        students_to_insert = []
        enrollments_to_insert = []
        assignments_to_insert = []
        batches_to_insert = []
        sabaq_to_insert = []
        prayer_to_insert = []
        behavior_to_insert = []
        complaints_to_insert = []

        total_students = 2500
        total_ustads = 125
        students_per_ustad = total_students // total_ustads # 20
        ustads_per_branch = [12]*10
        for i in range(5): ustads_per_branch[i] += 1 # distributed

        ustad_idx = 1
        student_idx = 1
        
        ninety_days_ago = date.today() - timedelta(days=90)
        dates_90_days = [ninety_days_ago + timedelta(days=i) for i in range(90)]

        print("Generating mock data in memory (this may take a minute)...")
        
        for branch_idx, br in enumerate(branch_objs):
            # Create Center Admin
            admin_user_id = uuid.uuid4()
            users_to_insert.append({
                "id": admin_user_id, "email": f"admin_{admin_user_id.hex[:10]}@suffat.com", "password_hash": hashed_pw,
                "full_name": fake.name(), "is_active": True, "is_verified": True
            })
            assignments_to_insert.append({
                "id": uuid.uuid4(), "user_id": admin_user_id, "role_id": role_admin.id, "institution_id": inst.id, "branch_id": br.id
            })
            staff_to_insert.append({
                "id": uuid.uuid4(), "user_id": admin_user_id, "branch_id": br.id,
                "employee_code": f"EMP-ADM-{admin_user_id.hex[:10]}", "designation": "Center Admin"
            })

            # Create Ustads and Batches
            for _ in range(ustads_per_branch[branch_idx]):
                u_user_id = uuid.uuid4()
                u_staff_id = uuid.uuid4()
                b_batch_id = uuid.uuid4()
                
                users_to_insert.append({
                    "id": u_user_id, "email": f"usthad_{u_user_id.hex[:10]}@suffat.com", "password_hash": hashed_pw,
                    "full_name": fake.name_male(), "is_active": True, "is_verified": True
                })
                assignments_to_insert.append({
                    "id": uuid.uuid4(), "user_id": u_user_id, "role_id": role_ustad.id, "institution_id": inst.id, "branch_id": br.id
                })
                staff_to_insert.append({
                    "id": u_staff_id, "user_id": u_user_id, "branch_id": br.id,
                    "employee_code": f"EMP-UST-{u_user_id.hex[:10]}", "designation": "Usthad"
                })
                
                # Batch
                batches_to_insert.append({
                    "id": b_batch_id, "branch_id": br.id, "academic_year_id": ay.id,
                    "course_id": mock_course_id, "name": f"Hifz Halqa {ustad_idx}"
                })

                # Create 20 Students for this Ustad
                for _ in range(students_per_ustad):
                    s_user_id = uuid.uuid4()
                    s_prof_id = uuid.uuid4()
                    s_enr_id = uuid.uuid4()
                    
                    
                    student_name = fake.name()
                    users_to_insert.append({
                        "id": s_user_id, "email": f"student_{student_idx}_{uuid.uuid4().hex[:8]}@suffat.com", "password_hash": hashed_pw,
                        "full_name": student_name, "is_active": True, "is_verified": True
                    })
                    assignments_to_insert.append({
                        "id": uuid.uuid4(), "user_id": s_user_id, "role_id": role_student.id, "institution_id": inst.id, "branch_id": br.id
                    })
                    students_to_insert.append({
                        "id": s_prof_id, "user_id": s_user_id, "branch_id": br.id,
                        "admission_number": f"ADM-{student_idx}-{uuid.uuid4().hex[:8]}", "date_of_birth": fake.date_of_birth(minimum_age=7, maximum_age=16),
                        "gender": random.choice(["Male", "Female"]), "guardian_name": fake.name(),
                        "guardian_phone": fake.phone_number()[:15], "guardian_email": fake.email()[:255],
                        "digital_documents": {}
                    })
                    enrollments_to_insert.append({
                        "id": s_enr_id, "institution_id": inst.id, "branch_id": br.id,
                        "student_id": s_prof_id, "batch_id": b_batch_id, "academic_year_id": ay.id,
                        "enrolled_at": date(2026, 4, 1),
                        "primary_parent_phone": fake.phone_number()[:15], "local_guardian_phone": fake.phone_number()[:15],
                        "blood_group": random.choice(["O+", "A+", "B+", "AB+", "O-"]), "medical_history": "None"
                    })

                    # History - 90 Days
                    # Let's do 1 record every 3 days to keep DB size manageable for the seed (90/3 * 2500 = 75,000 rows instead of 225,000)
                    for d_idx, d in enumerate(dates_90_days):
                        if d_idx % 3 == 0:
                            sabaq_to_insert.append({
                                "id": uuid.uuid4(), "institution_id": inst.id, "branch_id": br.id, "student_enrollment_id": s_enr_id,
                                "staff_id": u_staff_id, "date": d, "juz_number": random.randint(1, 30),
                                "page_start": 1, "page_end": 2, "grade": random.choice(['excellent', 'good', 'average']),
                                "teacher_notes": "Good progress" if random.random() > 0.2 else "Needs to focus on Tajweed"
                            })
                            prayer_to_insert.append({
                                "id": uuid.uuid4(), "institution_id": inst.id, "branch_id": br.id, "student_enrollment_id": s_enr_id,
                                "date": d, "fajr": True, "dhuhr": True, "asr": True, "maghrib": True, "isha": True
                            })
                            behavior_to_insert.append({
                                "id": uuid.uuid4(), "institution_id": inst.id, "branch_id": br.id, "student_enrollment_id": s_enr_id,
                                "staff_id": u_staff_id, "date": d, "adab_score": random.randint(7, 10),
                                "cleanliness_score": random.randint(7, 10), "respect_score": random.randint(7, 10)
                            })
                            
                    # Random Complaint
                    if random.random() < 0.05: # 5% chance of having a complaint
                        complaints_to_insert.append({
                            "id": uuid.uuid4(), "institution_id": inst.id, "branch_id": br.id, "student_enrollment_id": s_enr_id,
                            "against_role": ComplaintTargetType.USTAD, "against_profile_id": u_staff_id,
                            "recipient": ComplaintRecipientType.CENTER_ADMIN, "is_anonymous": random.choice([True, False]),
                            "title": "Facility Issue", "description": fake.text(), "status": random.choice(["OPEN", "RESOLVED"])
                        })

                    student_idx += 1
                ustad_idx += 1

        print("Executing bulk inserts to PostgreSQL...")
        
        async def chunked_insert(table, data, chunk_size=5000):
            for i in range(0, len(data), chunk_size):
                db.add_all([table(**d) for d in data[i:i+chunk_size]])
                await db.commit()

        await chunked_insert(User, users_to_insert)
        await chunked_insert(UserRoleAssignment, assignments_to_insert)
        await chunked_insert(StaffProfile, staff_to_insert)
        await chunked_insert(Batch, batches_to_insert)
        await chunked_insert(StudentProfile, students_to_insert)
        await chunked_insert(StudentEnrollment, enrollments_to_insert)
        
        print("Inserting 90 days history (Sabaq, Prayers, Behaviors)...")
        await chunked_insert(SabaqRecord, sabaq_to_insert)
        await chunked_insert(PrayerAttendance, prayer_to_insert)
        await chunked_insert(BehaviorLog, behavior_to_insert)
        await chunked_insert(Complaint, complaints_to_insert)

        print(f"Data Generation Complete:")
        print(f" - Students: {len(students_to_insert)}")
        print(f" - Sabaq Records: {len(sabaq_to_insert)}")
        print(f" - Prayer Records: {len(prayer_to_insert)}")
        print(f" - Behavior Records: {len(behavior_to_insert)}")
        print(f" - Complaints: {len(complaints_to_insert)}")
        
if __name__ == "__main__":
    asyncio.run(seed_massive_data())
