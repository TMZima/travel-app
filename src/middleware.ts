import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const PUBLIC_PATHS: string[] = ["/", "/login", "/signup"];

/**
 * Verifies a JWT token using the provided secret.
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret key for verification.
 * @returns {Promise<JWTPayload | null>} - The decoded payload if valid, otherwise null.
 */
async function verifyJWT(
  token: string,
  secret: string
): Promise<JWTPayload | null> {
  const secretKey = new TextEncoder().encode(secret);
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Next.js middleware for authentication and route protection.
 * - Allows public paths for everyone.
 * - Redirects authenticated users away from /login and /signup.
 * - Redirects unauthenticated users to /login for protected routes.
 * @param {NextRequest} req - The incoming Next.js request.
 * @returns {Promise<NextResponse>} The response for routing or redirection.
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Logging for debugging
  console.log("MIDDLEWARE: pathname:", pathname);
  console.log("MIDDLEWARE: token:", token);
  console.log("MIDDLEWARE: JWT_SECRET:", process.env.JWT_SECRET);

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/public")) {
    if (token && (pathname === "/login" || pathname === "/signup")) {
      const decoded = await verifyJWT(token, process.env.JWT_SECRET!);
      if (decoded) {
        console.log("MIDDLEWARE: token verified (login/signup)", decoded);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        console.log("MIDDLEWARE: token verification failed (login/signup)");
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    console.log("MIDDLEWARE: No token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decoded = await verifyJWT(token, process.env.JWT_SECRET!);
  if (decoded) {
    console.log("MIDDLEWARE: token verified (protected path)", decoded);
    return NextResponse.next();
  } else {
    console.log("MIDDLEWARE: token verification failed (protected path)");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

/**
 * Middleware config: apply to all routes except static files or API routes.
 */
export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};
