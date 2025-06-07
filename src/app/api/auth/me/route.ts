import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/auth";
import { AppError } from "@/utils/customErrors";
import { sendError, sendSuccess } from "@/utils/apiResponse";

/**
 * Returns whether the user is authenticated based on the JWT token cookie.
 *
 * @param req - The Next.js request object.
 * @returns JSON response with isLoggedIn and user info if authenticated.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return sendSuccess({ isLoggedIn: false });
    }

    const user = await getUserFromToken(token, process.env.JWT_SECRET!);
    if (!user) {
      return sendSuccess({ isLoggedIn: false });
    }

    return sendSuccess({ isLoggedIn: true, user });
  } catch (err) {
    if (err instanceof AppError) {
      return sendError(err);
    }
    return sendError(
      new AppError("Internal server error", 500, "Internal server error")
    );
  }
}
