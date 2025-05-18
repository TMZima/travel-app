import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// List of routes that do NOT require authentication
const PUBLIC_PATHS = ["/", "/login", "/signup"];

/**
 * Next.js middleware to handle authentication and route protection.
 * - Redirects authenticated users away from /login and /signup.
 * - Allows public paths for everyone.
 * - Redirects unauthenticated users to /login for protected routes.
 * @param req - The incoming Next.js request
 * @returns NextResponse for routing or redirection
 */
export function middleware(req: NextRequest): NextResponse | undefined {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 1. Allow static/public paths for everyone
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/public")) {
    if (token && (pathname === "/login" || pathname === "/signup")) {
      try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // Invalid token, let them see login/signup
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 2. For protected paths, require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

/**
 * Middleware config: apply to all routes except static files or API routes.
 */
export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};
