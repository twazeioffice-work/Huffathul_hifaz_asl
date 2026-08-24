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