const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany({ include: { branches: true } });
  const userCount = await prisma.user.count();
  const studentCount = await prisma.student.count();
  const employeeCount = await prisma.employee.count();
  const branchCount = await prisma.branch.count();
  const vehicleCount = await prisma.vehicle.count();
  const txCount = await prisma.transaction.count();
  const payrollCount = await prisma.payrollRecord.count();
  const sabaqCount = await prisma.sabaq.count();

  console.log("=== DB SUMMARY ===");
  console.log("Tenants & Branches:", JSON.stringify(tenants.map(t => ({ institutionCode: t.institutionCode, name: t.name, branches: t.branches.map(b => b.branchCode) })), null, 2));
  console.log({ branchCount, userCount, studentCount, employeeCount, vehicleCount, txCount, payrollCount, sabaqCount });

  const roles = await prisma.user.groupBy({ by: ['role'], _count: { id: true } });
  console.log("User roles distribution:", roles);

  const sampleUsers = await prisma.user.findMany({ take: 15, select: { id: true, email: true, role: true, tenantId: true, branchId: true } });
  console.log("Sample Users:", sampleUsers);

  const studentsSample = await prisma.student.findMany({ take: 5 });
  console.log("Sample Students:", studentsSample);

  const employeesSample = await prisma.employee.findMany({ take: 5 });
  console.log("Sample Employees:", employeesSample);
}

main().catch(console.error).finally(() => prisma.$disconnect());
