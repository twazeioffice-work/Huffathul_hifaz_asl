import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

const ROLE_HOME: Record<string, string> = {
  SUPER_ADMIN: "/app/suffat-hq/main/erp",
  GLOBAL_JUNCTION: "/app/suffat-hq/junction",
  CENTER_ADMIN: "/app/tenant/branch/erp",
  NAZIM: "/app/tenant/branch/erp",
  USTAD: "/app/tenant/branch/erp/academics",
  STUDENT: "/app/tenant/branch/portal/student",
  PARENT: "/app/tenant/branch/portal/parent"
};

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const publicPaths = ["/login"];

  const isPublic = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (!token) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;
    const institutionCode = payload.institution_code as string || "tenant";
    const branchCode = payload.branch_code as string || "branch";

    // Re-map the generic ROLE_HOME paths with actual tenant info
    const resolvedHome = (ROLE_HOME[role] || "/login")
      .replace("tenant", institutionCode)
      .replace("branch", branchCode);

    if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL(resolvedHome, request.url));
    }

    // Portal users cannot access ERP routes
    if (role === "STUDENT" || role === "PARENT") {
      if (request.nextUrl.pathname.includes("/erp")) {
        return NextResponse.redirect(new URL(resolvedHome, request.url));
      }
    }

    // USTAD cannot access general ERP, only their academics section
    if (role === "USTAD") {
      if (request.nextUrl.pathname.includes("/erp") && !request.nextUrl.pathname.includes("/erp/academics")) {
        return NextResponse.redirect(new URL(resolvedHome, request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token, clear it and redirect to login (or continue if already on login)
    const response = isPublic ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api).*)"]
};
