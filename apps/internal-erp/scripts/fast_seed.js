const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fastSqlSeed() {
  console.log("Running fast SQL insert for students...");
  const count = await prisma.$executeRawUnsafe(`
    INSERT OR IGNORE INTO User (id, email, hashedPassword, role, tenantId, branchId, createdAt)
    SELECT 
      lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)),2) || '-a' || substr(hex(randomblob(2)),2) || '-' || hex(randomblob(6))),
      lower(s.studentCode) || '@suffat.edu',
      'StudentPass2026!',
      'STUDENT',
      b.tenantId,
      s.branchId,
      CURRENT_TIMESTAMP
    FROM Student s
    JOIN Branch b ON s.branchId = b.id
  `);
  console.log(`Direct SQL Insert finished, affected rows: ${count}`);

  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
  console.log(`Total Student users in User table: ${totalStudents}`);
}

fastSqlSeed().catch(console.error).finally(() => prisma.$disconnect());
