const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.count({ where: { role: 'STUDENT' } });
  console.log(`Current student users in DB: ${users}`);
}
run().finally(() => prisma.$disconnect());
