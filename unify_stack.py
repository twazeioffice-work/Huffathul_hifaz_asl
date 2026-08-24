import os
import subprocess

BASE_DIR = r"E:\Huffathul Hifaaz_asl\apps\internal-erp"

# 1. Ensure directory structure for APIs
API_DIR = os.path.join(BASE_DIR, "src", "app", "api")
os.makedirs(os.path.join(API_DIR, "auth", "token"), exist_ok=True)
os.makedirs(os.path.join(API_DIR, "students"), exist_ok=True)
os.makedirs(os.path.join(API_DIR, "sabaq"), exist_ok=True)

# 2. Write schema.prisma
PRISMA_DIR = os.path.join(BASE_DIR, "prisma")
os.makedirs(PRISMA_DIR, exist_ok=True)

SCHEMA = """
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Tenant {
  id               String   @id @default(uuid())
  institutionCode  String   @unique
  name             String
  branches         Branch[]
  users            User[]
}

model Branch {
  id         String   @id @default(uuid())
  branchCode String   @unique
  name       String
  tenantId   String
  tenant     Tenant   @relation(fields: [tenantId], references: [id])
  users      User[]
  students   Student[]
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  hashedPassword String
  role           String   // SUPER_ADMIN, CENTER_ADMIN, NAZIM, USTAD, PARENT
  tenantId       String?
  tenant         Tenant?  @relation(fields: [tenantId], references: [id])
  branchId       String?
  branch         Branch?  @relation(fields: [branchId], references: [id])
  createdAt      DateTime @default(now())
}

model Student {
  id           String   @id @default(uuid())
  studentCode  String   @unique
  name         String
  status       String   @default("active")
  branchId     String
  branch       Branch   @relation(fields: [branchId], references: [id])
  sabaqRecords Sabaq[]
}

model Sabaq {
  id           String   @id @default(uuid())
  studentId    String
  student      Student  @relation(fields: [studentId], references: [id])
  surah        String
  startAyah    Int
  endAyah      Int
  mistakes     Int      @default(0)
  grade        String
  date         DateTime @default(now())
}
"""
with open(os.path.join(PRISMA_DIR, "schema.prisma"), "w") as f:
    f.write(SCHEMA.strip())

# 3. Write Auth API Route (Replacing mock_fastapi.js)
AUTH_ROUTE = """
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET = new TextEncoder().encode("supersecretkey");

export async function POST(req: Request) {
  try {
    const { username_or_email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: username_or_email },
      include: { tenant: true, branch: true }
    });

    // Extremely basic password check for MVP handover (replace with bcrypt later)
    if (!user || user.hashedPassword !== password) {
      return NextResponse.json({ detail: "Incorrect email or password" }, { status: 400 });
    }

    const institution_code = user.tenant?.institutionCode || "tenant";
    const branch_code = user.branch?.branchCode || "branch";

    const token = await new SignJWT({
      sub: user.email,
      role: user.role,
      institution_code,
      branch_code
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(SECRET);

    const response = NextResponse.json({
      landing_url: user.role === 'SUPER_ADMIN' ? '/app/suffat-hq/main/erp' : `/app/${institution_code}/${branch_code}/erp`
    });

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
"""
with open(os.path.join(API_DIR, "auth", "token", "route.ts"), "w") as f:
    f.write(AUTH_ROUTE.strip())

# 4. Write Database Seeder
SEED_SCRIPT = """
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hq = await prisma.tenant.create({ data: { institutionCode: 'suffat-hq', name: 'Suffat HQ' } });
  const suffat = await prisma.tenant.create({ data: { institutionCode: 'suffat', name: 'Suffat Academy' } });

  const hqMain = await prisma.branch.create({ data: { branchCode: 'main', name: 'HQ Main', tenantId: hq.id } });
  const suffatMain = await prisma.branch.create({ data: { branchCode: 'main', name: 'Suffat Main', tenantId: suffat.id } });

  await prisma.user.createMany({
    data: [
      { email: 'admin@suffat.org', hashedPassword: 'password123', role: 'SUPER_ADMIN', tenantId: hq.id, branchId: hqMain.id },
      { email: 'admin_aa59cbc5f3@suffat.com', hashedPassword: 'password123', role: 'CENTER_ADMIN', tenantId: suffat.id, branchId: suffatMain.id },
      { email: 'manager@suffat.com', hashedPassword: 'password123', role: 'NAZIM', tenantId: suffat.id, branchId: suffatMain.id },
      { email: 'usthad_51c88a81db@suffat.com', hashedPassword: 'password123', role: 'USTAD', tenantId: suffat.id, branchId: suffatMain.id }
    ]
  });

  await prisma.student.createMany({
    data: [
      { studentCode: 'STU-001', name: 'Ahmed Abdullah', branchId: suffatMain.id },
      { studentCode: 'STU-002', name: 'Omar Farooq', branchId: suffatMain.id },
      { studentCode: 'STU-003', name: 'Zaid Bin Harith', branchId: suffatMain.id },
    ]
  });

  console.log("Database seeded successfully.");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
"""
with open(os.path.join(BASE_DIR, "prisma", "seed.js"), "w") as f:
    f.write(SEED_SCRIPT.strip())

print("Unified Full-Stack Architecture Ready.")
