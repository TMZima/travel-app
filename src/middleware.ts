import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/public", "/api/public"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths without authentication
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies for protected paths
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);

    // If valid token, proceed to the requested page
    return NextResponse.next();
  } catch (err: unknown) {
    console.error("Invalid token:", err instanceof Error ? err.message : err);

    // Redirect invalid tokens to the login page
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  // Regex to match everything except the defined public paths
  matcher: ["/((?!api/public|login|signup|public).*)"],
};
