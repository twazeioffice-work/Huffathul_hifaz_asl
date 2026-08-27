const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedStudentCredentials() {
  console.log("Starting Student Credentials Generation...");
  const students = await prisma.student.findMany({
    include: {
      branch: {
        include: {
          tenant: true
        }
      }
    }
  });

  console.log(`Found ${students.length} students to provision.`);
  let createdCount = 0;
  let skippedCount = 0;

  for (const student of students) {
    const email = `${student.studentCode.toLowerCase()}@suffat.edu`;
    const defaultPassword = "StudentPass2026!";

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email,
          hashedPassword: defaultPassword,
          role: "STUDENT",
          tenantId: student.branch?.tenantId || null,
          branchId: student.branchId
        }
      });
      createdCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`Student Credentials provisioning complete! Created: ${createdCount}, Skipped: ${skippedCount}`);

  // Also ensure a demo student exists with a simple email for testing
  const demoEmail = "student@suffat.edu";
  const existingDemo = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingDemo && students.length > 0) {
    await prisma.user.create({
      data: {
        email: demoEmail,
        hashedPassword: "StudentPass2026!",
        role: "STUDENT",
        tenantId: students[0].branch?.tenantId || null,
        branchId: students[0].branchId
      }
    });
    console.log("Created demo student account: student@suffat.edu / StudentPass2026!");
  }
}

seedStudentCredentials().catch(console.error).finally(() => prisma.$disconnect());
