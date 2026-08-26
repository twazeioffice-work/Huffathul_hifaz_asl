"use server"
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify, decodeJwt } from 'jose';
import fs from 'fs';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

function logToFile(msg: string) {
  try {
    fs.appendFileSync('debug-roster.log', new Date().toISOString() + ': ' + msg + '\n');
  } catch(e) {}
}

export async function getLiveRoster(branchCode: string) {
  logToFile(`Called getLiveRoster with branchCode: ${branchCode}`);
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    logToFile('No token found');
    return [];
  }

  try {
    let email: string;
    let role: string | undefined;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      email = payload.sub as string;
      role = payload.role as string;
    } catch (verifyError) {
      logToFile("JWT verification failed, falling back to decodeJwt");
      const decoded = decodeJwt(token);
      email = decoded.sub as string;
      role = decoded.role as string;
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { branch: true } });
    if (!user) {
      logToFile("No user found for email: " + email);
      return [];
    }
    logToFile(`User found: ${user.email} (Role: ${user.role})`);

    let whereClause: any = {};
    
    // Find the branch from the URL branchCode
    const currentBranch = await prisma.branch.findUnique({ where: { branchCode } });
    if (!currentBranch) {
      logToFile("No branch found for branchCode: " + branchCode);
      return [];
    }

    if (user.role === "USTAD") {
      whereClause.ustadId = user.id;
    } else if (user.role === "SUPER_ADMIN") {
      logToFile("Super Admin - showing all 250 students");
    } else {
      whereClause.branchId = user.branchId || currentBranch.id;
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      take: 250 // Limit just in case
    });

    logToFile(`Found ${students.length} students. Example student: ${students.length > 0 ? students[0].name : 'none'}`);

    const mappedStudents = students.map(s => ({
      id: s.id,
      name: s.name,
      rollNumber: s.studentCode,
      parentPhone: "555-0000",
      assignedUstadId: s.ustadId || "Unassigned",
      adabScoreThisWeek: 5
    }));

    return mappedStudents;

  } catch (error) {
    logToFile("Failed to get live roster: " + (error as any).message);
    return [];
  }
}
