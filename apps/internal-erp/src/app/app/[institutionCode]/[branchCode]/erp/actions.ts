"use server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getDashboardMetrics(institutionCode: string, branchCode: string) {
  const currentBranch = await prisma.branch.findUnique({ where: { branchCode } });
  if (!currentBranch) return { totalStudents: 0, activeUstads: 0, todayAttendance: "0%", activeCases: 0, kitchenHeadcount: 0, monthlyRevenue: "Rs 45,230", monthlyExpenses: "Rs 22,000", whatsappUnread: 0 };

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
    monthlyRevenue: "Rs 45,230",
    monthlyExpenses: "Rs 22,000",
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
    take: 20
  });

  return {
    totalStudents,
    activeBatches: isGlobal ? 42 : 5,
    averageAttendance: "94.2%",
    studentsList
  };
}

export async function getUstadsMetrics(institutionCode: string, branchCode: string) {
  const currentBranch = await prisma.branch.findUnique({ where: { branchCode } });
  const isGlobal = institutionCode === "suffat-hq";

  const ustads = await prisma.user.findMany({
    where: isGlobal ? { role: 'USTAD' } : { role: 'USTAD', branchId: currentBranch?.id },
    include: { branch: true },
    take: 20
  });

  const employees = await prisma.employee.findMany({
    where: isGlobal ? { role: 'USTAD' } : { role: 'USTAD', branchId: currentBranch?.id },
    take: 20
  });

  const employeeMap = new Map(employees.map(e => [e.userId || e.email, e]));

  const list = ustads.map(u => {
    const emp = employeeMap.get(u.id) || employeeMap.get(u.email);
    return {
      id: u.id.slice(0, 8).toUpperCase(),
      name: emp?.name || u.email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: u.email,
      halqa: "Hifz Circle",
      students: 19,
      rating: 4.9,
      branchName: u.branch?.name || "HQ"
    };
  });

  return {
    totalUstads: isGlobal ? 131 : ustads.length,
    ustadsList: list
  };
}

export async function getStudentDetail(studentId: string) {
  const student = await prisma.student.findFirst({
    where: {
      OR: [
        { id: studentId },
        { studentCode: studentId }
      ]
    },
    include: { branch: true, sabaqRecords: true }
  });

  if (!student) return null;

  return {
    id: student.id,
    name: student.name,
    studentCode: student.studentCode,
    status: student.status,
    branchName: student.branch.name,
    currentJuz: 15,
    sabaqHistory: student.sabaqRecords
  };
}
