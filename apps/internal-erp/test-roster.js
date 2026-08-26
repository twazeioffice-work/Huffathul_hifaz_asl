const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const email = 'admin@suffat.org';
  const branchCode = 'main';
  const user = await prisma.user.findUnique({ where: { email }, include: { branch: true } });
  const currentBranch = await prisma.branch.findUnique({ where: { branchCode } });
  
  let whereClause = {};
  if (user.role === 'USTAD') whereClause.ustadId = user.id;
  else if (user.role === 'SUPER_ADMIN') {
    // nothing
  } else {
    whereClause.branchId = user.branchId || currentBranch.id;
  }
  
  const students = await prisma.student.findMany({ where: whereClause, take: 250 });
  console.log('Students count:', students.length);
  if (students.length > 0) {
    console.log('First student:', students[0].name);
  }
}
main();
