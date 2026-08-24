import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const employees = await prisma.employee.findMany();
    return NextResponse.json(employees);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch payroll' }, { status: 500 });
  }
}
