import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

export async function POST(req: Request) {
  try {
    const { username_or_email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: username_or_email },
      include: { tenant: true, branch: true }
    });

    if (!user || user.hashedPassword !== password) {
      return NextResponse.json({ detail: "Incorrect email or password" }, { status: 400 });
    }

    const institution_code = user.tenant?.institutionCode || "tenant";
    const branch_code = user.branch?.branchCode || "branch";

    const token = await new SignJWT({
      sub: user.email,
      role: user.role,
      institution_code,
      branch_code
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(SECRET);

    const response = NextResponse.json({
      landing_url: user.role === 'SUPER_ADMIN' ? '/app/suffat-hq/main/erp' : `/app/${institution_code}/${branch_code}/erp`
    });

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}