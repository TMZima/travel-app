import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/auth"; // Use your shared JWT utility

const PUBLIC_PATHS: string[] = ["/", "/login", "/signup"];

/**
 * Next.js middleware for authentication and route protection.
 * - Allows public paths for everyone.
 * - Redirects authenticated users away from /, /login, and /signup.
 * - Redirects unauthenticated users to /login for protected routes.
 * @param {NextRequest} req - The incoming Next.js request.
 * @returns {Promise<NextResponse>} The response for routing or redirection.
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isPublicPath =
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/public");

  if (token) {
    try {
      const decoded = await getUserFromToken(token, process.env.JWT_SECRET!);

      if (decoded) {
        if (PUBLIC_PATHS.includes(pathname)) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next(); // Valid token, allow access
      }
    } catch (err) {
      console.warn("Token validation failed:", err);
      // Fall through to unauthenticated handling
    }

    // Invalid token: treat as unauthenticated
    if (isPublicPath) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // No token present
  if (isPublicPath) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

/**
 * Middleware config: apply to all routes except static files or API routes.
 */
export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};
