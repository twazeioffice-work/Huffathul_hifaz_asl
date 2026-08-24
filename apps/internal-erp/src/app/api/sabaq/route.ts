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