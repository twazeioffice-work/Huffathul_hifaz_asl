import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

export async function POST(req: Request) {
  try {
    const { username_or_email, password } = await req.json();
    const query = (username_or_email || "").trim().toLowerCase();

    // Support email lookup or student code lookup
    let user = await prisma.user.findUnique({
      where: { email: query },
      include: { tenant: true, branch: true }
    });

    if (!user && !query.includes('@')) {
      user = await prisma.user.findUnique({
        where: { email: `${query}@suffat.edu` },
        include: { tenant: true, branch: true }
      });
    }

    if (!user || user.hashedPassword !== password) {
      return NextResponse.json({ detail: "Incorrect email or password" }, { status: 400 });
    }

    const institution_code = user.tenant?.institutionCode || "suffat";
    const branch_code = user.branch?.branchCode || "main";

    const token = await new SignJWT({
      sub: user.email,
      role: user.role,
      institution_code,
      branch_code
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET);

    let landing_url = `/app/${institution_code}/${branch_code}/erp`;
    if (user.role === 'SUPER_ADMIN') {
      landing_url = '/app/suffat-hq/main/erp';
    } else if (user.role === 'STUDENT') {
      landing_url = `/app/${institution_code}/${branch_code}/portal/student`;
    } else if (user.role === 'PARENT') {
      landing_url = `/app/${institution_code}/${branch_code}/portal/parent/notices`;
    } else if (user.role === 'USTAD') {
      landing_url = `/app/${institution_code}/${branch_code}/erp/academics`;
    }

    const response = NextResponse.json({
      landing_url,
      role: user.role
    });

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error) {
    console.error("Auth Token Error:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
