const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finishProvision() {
  const students = await prisma.student.findMany({ include: { branch: true } });
  const existingUsers = new Set((await prisma.user.findMany({ select: { email: true } })).map(u => u.email));

  const missing = [];
  for (const s of students) {
    const email = `${s.studentCode.toLowerCase()}@suffat.edu`;
    if (!existingUsers.has(email)) {
      missing.push({
        email,
        hashedPassword: "StudentPass2026!",
        role: "STUDENT",
        tenantId: s.branch?.tenantId || null,
        branchId: s.branchId
      });
      existingUsers.add(email);
    }
  }

  if (!existingUsers.has("student@suffat.edu") && students.length > 0) {
    missing.push({
      email: "student@suffat.edu",
      hashedPassword: "StudentPass2026!",
      role: "STUDENT",
      tenantId: students[0].branch?.tenantId || null,
      branchId: students[0].branchId
    });
  }

  if (missing.length > 0) {
    console.log(`Inserting remaining ${missing.length} users...`);
    for (const u of missing) {
      try {
        await prisma.user.create({ data: u });
      } catch(e) {}
    }
  }

  const total = await prisma.user.count({ where: { role: 'STUDENT' } });
  console.log(`Final Student users in DB: ${total}`);
}

finishProvision().finally(() => prisma.$disconnect());
