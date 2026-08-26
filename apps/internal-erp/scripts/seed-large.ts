import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CENTERS = [
  "Main Campus HQ", "North Campus", "South Campus", "East Wing", "West Wing",
  "Downtown Branch", "Uptown Branch", "Suburban Center", "Valley Center", "Hilltop Campus"
];

const NAZIM_NAMES = [
  "Abdur Rahman", "Tariq Jameel", "Mufti Menk", "Ismail Musa", "Yasir Qadhi",
  "Omar Suleiman", "Bilal Philips", "Nouman Ali", "Hamza Yusuf", "Zakir Naik"
];

const FIRST_NAMES = ["Ahmed", "Mohammad", "Ali", "Omar", "Osman", "Abu", "Zaid", "Bilal", "Yusuf", "Hamza", "Abdullah", "Saad", "Talha", "Zubair", "Khalid"];
const LAST_NAMES = ["Khan", "Ali", "Ahmed", "Syed", "Shah", "Qureshi", "Malik", "Sheikh", "Farooq", "Hassan", "Ibrahim", "Tariq", "Hussain", "Mahmoud", "Siddiqui"];

function getRandomName() {
  const f = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const l = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${f} ${l}`;
}

async function main() {
  console.log("Starting large seed...");

  let tenant = await prisma.tenant.findUnique({ where: { institutionCode: 'suffat' } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        institutionCode: 'suffat',
        name: 'Suffat-ul Huffaz'
      }
    });
  }

  const tenantId = tenant.id;

  for (let c = 0; c < 10; c++) {
    const branchName = CENTERS[c];
    const branchCode = `BR-00${c+1}`;
    console.log(`Processing Center: ${branchName} (${branchCode})`);

    let branch = await prisma.branch.findUnique({ where: { branchCode } });
    if (!branch) {
      branch = await prisma.branch.create({
        data: {
          branchCode,
          name: branchName,
          tenantId,
        }
      });
    }

    const branchId = branch.id;

    const nazimEmail = `nazim${c+1}@suffat.edu`;
    let nazimUser = await prisma.user.findUnique({ where: { email: nazimEmail } });
    if (!nazimUser) {
      nazimUser = await prisma.user.create({
        data: {
          email: nazimEmail,
          hashedPassword: "password",
          role: "NAZIM",
          tenantId,
          branchId
        }
      });
      await prisma.employee.create({
        data: {
          name: NAZIM_NAMES[c],
          role: "NAZIM",
          salary: 50000,
          email: nazimEmail,
          userId: nazimUser.id,
          branchId
        }
      });
    }

    const ustads = [];
    for (let u = 1; u <= 13; u++) {
      const ustadEmail = `ustad.c${c+1}.u${u}@suffat.edu`;
      let ustadUser = await prisma.user.findUnique({ where: { email: ustadEmail } });
      if (!ustadUser) {
        ustadUser = await prisma.user.create({
          data: {
            email: ustadEmail,
            hashedPassword: "password",
            role: "USTAD",
            tenantId,
            branchId
          }
        });
        await prisma.employee.create({
          data: {
            name: `Ustad ${getRandomName()}`,
            role: "USTAD",
            salary: 30000,
            email: ustadEmail,
            userId: ustadUser.id,
            branchId
          }
        });
      }
      ustads.push(ustadUser);
    }

    let studentOffset = c * 250;
    const studentsToCreate = [];
    for (let s = 1; s <= 250; s++) {
      const studentCode = `STU-26-${(studentOffset + s).toString().padStart(4, '0')}`;
      const assignedUstad = ustads[Math.floor((s - 1) / 20)] || ustads[12];
      
      studentsToCreate.push({
        studentCode,
        name: getRandomName(),
        branchId,
        ustadId: assignedUstad.id
      });
    }

    try {
      await prisma.student.createMany({
        data: studentsToCreate
      });
      console.log(`Created 250 students for ${branchName}`);
    } catch (e) {
      console.error(`Error creating students for ${branchName}:`, e);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
