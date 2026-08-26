"use server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getDashboardMetrics(branchCode: string) {
  const currentBranch = await prisma.branch.findUnique({ where: { branchCode } });
  if (!currentBranch) return { totalStudents: 0, activeUstads: 0, todayAttendance: 0, activeCases: 0 };

  const totalStudents = await prisma.student.count({
    where: { branchId: currentBranch.id }
  });

  const activeUstads = await prisma.user.count({
    where: { branchId: currentBranch.id, role: 'USTAD' }
  });

  return { 
    totalStudents, 
    activeUstads,
    todayAttendance: "96.4%", // Mock for now until attendance ledger is seeded
    activeCases: 0,
    monthlyRevenue: "?0",
    monthlyExpenses: "?0",
    kitchenHeadcount: totalStudents, // Assuming all students eat
    whatsappUnread: 0
  };
}
