import os

BASE_DIR = r"E:\Huffathul Hifaaz_asl\apps\internal-erp\src\app\api"

# Route: /api/students
STUDENTS_ROUTE = """
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');

    const students = await prisma.student.findMany({
      where: branchId ? { branchId } : {},
      include: {
        sabaqRecords: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    });

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
"""

# Route: /api/sabaq
SABAQ_ROUTE = """
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const sabaq = await prisma.sabaq.create({
      data: {
        studentId: data.studentId,
        surah: data.surah,
        startAyah: parseInt(data.startAyah),
        endAyah: parseInt(data.endAyah),
        mistakes: parseInt(data.mistakes) || 0,
        grade: data.grade,
      }
    });

    return NextResponse.json(sabaq);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
"""

os.makedirs(os.path.join(BASE_DIR, "students"), exist_ok=True)
with open(os.path.join(BASE_DIR, "students", "route.ts"), "w") as f:
    f.write(STUDENTS_ROUTE.strip())

os.makedirs(os.path.join(BASE_DIR, "sabaq"), exist_ok=True)
with open(os.path.join(BASE_DIR, "sabaq", "route.ts"), "w") as f:
    f.write(SABAQ_ROUTE.strip())

print("API Routes Created.")
