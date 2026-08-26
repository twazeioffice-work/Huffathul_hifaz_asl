"use server"
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

export async function getLiveRoster(branchCode: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return [];

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.sub as string;

    const user = await prisma.user.findUnique({ where: { email }, include: { branch: true } });
    if (!user) {
      console.log("No user found for email:", email);
      return [];
    }

    let whereClause: any = {};
    
    // Find the branch from the URL branchCode
    const currentBranch = await prisma.branch.findUnique({ where: { branchCode } });
    if (!currentBranch) {
      console.log("No branch found for branchCode:", branchCode);
      return [];
    }

    if (user.role === "USTAD") {
      // Ustads only see their students
      whereClause.ustadId = user.id;
    } else if (user.role === "SUPER_ADMIN") {
      // Super admin sees all students to preview the database! 
      // We remove branchId filter so it pulls from the 2500 seeded students.
    } else {
      // Nazims and others see students in their assigned branch
      whereClause.branchId = user.branchId || currentBranch.id;
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      take: 250 // Limit just in case
    });

    console.log(`getLiveRoster: found ${students.length} students for user ${user.role} in branch ${branchCode}`);

    return students.map(s => ({
      id: s.id,
      name: s.name,
      rollNumber: s.studentCode,
      parentPhone: "555-0000",
      assignedUstadId: s.ustadId || "Unassigned",
      adabScoreThisWeek: 5
    }));
  } catch (error) {
    console.error("Failed to get live roster:", error);
    return [];
  }
}
