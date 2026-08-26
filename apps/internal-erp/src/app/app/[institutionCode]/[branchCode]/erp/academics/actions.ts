"use server"
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

export async function getLiveRoster() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return [];

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.sub as string;

    const user = await prisma.user.findUnique({ where: { email }, include: { branch: true } });
    if (!user) return [];

    let whereClause: any = {};
    
    // If the user is an USTAD, only return their students.
    if (user.role === "USTAD") {
      whereClause.ustadId = user.id;
    } else {
      // If Nazim or Center Admin, they can see all students in their branch
      whereClause.branchId = user.branchId;
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      take: 250 // Limit just in case
    });

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
