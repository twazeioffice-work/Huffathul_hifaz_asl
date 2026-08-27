"use server";
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify, decodeJwt } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

export async function getCurrentUserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    let email = "";
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      email = payload.sub as string;
    } catch {
      const decoded = decodeJwt(token);
      email = decoded.sub as string;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { branch: true, tenant: true }
    });

    if (!user) return null;

    // Check if there is an employee record
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { email: user.email }
        ]
      }
    });

    return {
      id: user.id,
      email: user.email,
      name: employee?.name || user.email.split('@')[0],
      role: user.role,
      institutionCode: user.tenant?.institutionCode || "suffat",
      branchCode: user.branch?.branchCode || "main",
      branchName: user.branch?.name || "HQ / Central",
      joiningDate: employee?.joiningDate || user.createdAt
    };
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error);
    return null;
  }
}

export async function updatePassword(newPassword: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return { success: false, error: "Unauthorized" };

  try {
    let email = "";
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      email = payload.sub as string;
    } catch {
      const decoded = decodeJwt(token);
      email = decoded.sub as string;
    }

    await prisma.user.update({
      where: { email },
      data: { hashedPassword: newPassword }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update password" };
  }
}
