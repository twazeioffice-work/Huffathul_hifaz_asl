import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, role, salary, joiningDate, email, phone, emergencyContact, education, cvUrl, branchCode } = data;

    if (!name || !role || !salary || !branchCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Resolve branchCode to branchId
    const branch = await prisma.branch.findUnique({
      where: { branchCode }
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const branchId = branch.id;
    const tenantId = branch.tenantId;

    let userId = null;

    if (email && role !== 'SUPPORT STAFF') {
      const hashedPassword = '123456'; // MVP uses plain text temporarily
      
      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword,
          role: role === 'USTAD' || role === 'NAZIM' || role === 'CENTER_ADMIN' ? role : 'USTAD',
          branchId,
          tenantId, // Store tenantId for the user as per the schema
        },
      });
      userId = user.id;
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        role,
        salary: parseFloat(salary),
        joiningDate: joiningDate ? new Date(joiningDate) : null,
        email,
        phone,
        emergencyContact,
        education,
        cvUrl,
        branchId,
        userId,
      },
    });

    return NextResponse.json({ employee }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
