import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock function for decryptJWT since we don't have the real implementation details yet
async function decryptJWT(token: string) {
    // In a real implementation, you would decode the JWT here
    // For now, if the token is "demo_ustad", etc., we parse it
    // Wait, the blueprint says: The Edge Middleware decrypts the HTTP-only cookie.
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch {
        return { role: 'UNKNOWN', branch_id: 'unknown' };
    }
}

export async function middleware(request: NextRequest) {
    // For demo purposes, the frontend is currently using `demo_auth_role`
    const demoRole = request.cookies.get("demo_auth_role")?.value;
    const token = request.cookies.get("session_token")?.value;

    let role = "UNKNOWN";
    let branch_id = "unknown";
    
    if (demoRole) {
        role = demoRole;
    } else if (token) {
        const payload = await decryptJWT(token);
        role = payload.role || "UNKNOWN";
        branch_id = payload.branch_id || "unknown";
    }

    if (!token && !demoRole) {
        // Only redirect if they are trying to access protected routes
        if (request.nextUrl.pathname.startsWith('/app') || request.nextUrl.pathname.startsWith('/portal')) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    const pathParts = request.nextUrl.pathname.split("/");
    // Example path: /app/SUF/MAIN/erp/...
    // pathParts: ["", "app", "SUF", "MAIN", "erp", ...]
    const routeBranch = pathParts.length > 3 ? pathParts[3] : null;

    // Prevent role mix-up: Redirect users to their specific landing pages
    if (role === "USTAD" && request.nextUrl.pathname.startsWith("/app") && !request.nextUrl.pathname.includes("/erp/academics")) {
        const targetBranch = routeBranch || branch_id;
        return NextResponse.redirect(new URL(`/app/SUF/${targetBranch}/erp/academics`, request.url));
    }
    if (role === "PARENT" && request.nextUrl.pathname.startsWith("/app")) {
        return NextResponse.redirect(new URL(`/portal/parent`, request.url));
    }

    // Prevent Center cross-contamination at routing level
    if (role !== "SUPER_ADMIN" && role !== "GLOBAL_OPERATIONS" && routeBranch && branch_id !== "unknown") {
        // In a real system, verify routeBranch == branch_id
        // We'll leave it open for demo role switcher
        if (!demoRole && routeBranch !== branch_id) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/app/:path*', '/portal/:path*'],
};
