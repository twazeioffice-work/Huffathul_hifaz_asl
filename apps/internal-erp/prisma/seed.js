const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.sabaq.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.tenant.deleteMany();

  const hq = await prisma.tenant.create({ data: { institutionCode: 'suffat-hq', name: 'Suffat HQ' } });
  const suffat = await prisma.tenant.create({ data: { institutionCode: 'suffat', name: 'Suffat Academy' } });

  const hqMain = await prisma.branch.create({ data: { branchCode: 'hq-main', name: 'HQ Main', tenantId: hq.id } });
  const suffatMain = await prisma.branch.create({ data: { branchCode: 'main', name: 'Suffat Main', tenantId: suffat.id } });

  await prisma.user.createMany({
    data: [
      { email: 'admin@suffat.org', hashedPassword: 'password123', role: 'SUPER_ADMIN', tenantId: hq.id, branchId: hqMain.id },
      { email: 'admin_aa59cbc5f3@suffat.com', hashedPassword: 'password123', role: 'CENTER_ADMIN', tenantId: suffat.id, branchId: suffatMain.id },
      { email: 'manager@suffat.com', hashedPassword: 'password123', role: 'NAZIM', tenantId: suffat.id, branchId: suffatMain.id },
      { email: 'usthad_51c88a81db@suffat.com', hashedPassword: 'password123', role: 'USTAD', tenantId: suffat.id, branchId: suffatMain.id }
    ]
  });

  await prisma.student.createMany({
    data: [
      { studentCode: 'STU-001', name: 'Ahmed Abdullah', branchId: suffatMain.id },
      { studentCode: 'STU-002', name: 'Omar Farooq', branchId: suffatMain.id },
      { studentCode: 'STU-003', name: 'Zaid Bin Harith', branchId: suffatMain.id },
    ]
  });

  console.log("Database seeded successfully.");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });