"use server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getDashboardMetrics(institutionCode: string, branchCode: string) {
  const currentBranch = await prisma.branch.findUnique({ where: { branchCode } });
  if (!currentBranch) return { totalStudents: 0, activeUstads: 0, todayAttendance: 0, activeCases: 0 };

  const isGlobal = institutionCode === "suffat-hq";

  const totalStudents = await prisma.student.count(isGlobal ? undefined : {
    where: { branchId: currentBranch.id }
  });

  const activeUstads = await prisma.user.count(isGlobal ? { where: { role: 'USTAD' } } : {
    where: { branchId: currentBranch.id, role: 'USTAD' }
  });

  return { 
    totalStudents, 
    activeUstads,
    todayAttendance: "96.4%",
    activeCases: 0,
    monthlyRevenue: "?0",
    monthlyExpenses: "?0",
    kitchenHeadcount: totalStudents,
    whatsappUnread: 0
  };
}

export async function getStudentMetrics(institutionCode: string, branchCode: string) {
  const currentBranch = await prisma.branch.findUnique({ where: { branchCode } });
  if (!currentBranch) return { totalStudents: 0, activeBatches: 0, averageAttendance: "0%", studentsList: [] };

  const isGlobal = institutionCode === "suffat-hq";

  const totalStudents = await prisma.student.count(isGlobal ? undefined : {
    where: { branchId: currentBranch.id }
  });

  const studentsList = await prisma.student.findMany({
    where: isGlobal ? undefined : { branchId: currentBranch.id },
    take: 10
  });

  return {
    totalStudents,
    activeBatches: isGlobal ? 42 : 5, // mock for batches until batch model is implemented
    averageAttendance: "94.2%",
    studentsList
  };
}
