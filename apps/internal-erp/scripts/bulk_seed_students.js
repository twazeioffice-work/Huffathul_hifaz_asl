const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function bulkProvision() {
  console.log("Bulk provisioning students...");
  const students = await prisma.student.findMany({
    include: {
      branch: true
    }
  });

  const existingUsers = new Set((await prisma.user.findMany({ select: { email: true } })).map(u => u.email));

  const newUsers = [];
  for (const student of students) {
    const email = `${student.studentCode.toLowerCase()}@suffat.edu`;
    if (!existingUsers.has(email)) {
      newUsers.push({
        email,
        hashedPassword: "StudentPass2026!",
        role: "STUDENT",
        tenantId: student.branch?.tenantId || null,
        branchId: student.branchId
      });
      existingUsers.add(email);
    }
  }

  if (!existingUsers.has("student@suffat.edu") && students.length > 0) {
    newUsers.push({
      email: "student@suffat.edu",
      hashedPassword: "StudentPass2026!",
      role: "STUDENT",
      tenantId: students[0].branch?.tenantId || null,
      branchId: students[0].branchId
    });
  }

  console.log(`Inserting ${newUsers.length} student user accounts...`);
  if (newUsers.length > 0) {
    await prisma.user.createMany({
      data: newUsers
    });
  }

  const totalUsers = await prisma.user.count();
  const studentUsers = await prisma.user.count({ where: { role: "STUDENT" } });
  console.log(`Total users in DB: ${totalUsers}, Student users: ${studentUsers}`);
}

bulkProvision().catch(console.error).finally(() => prisma.$disconnect());
