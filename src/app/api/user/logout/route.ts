import { NextResponse } from "next/server";
import { sendError } from "@/utils/apiResponse";
import { BadRequestError } from "@/utils/customErrors";

/**
 * API Route: Logs out the user by clearing the auth token cookie.
 * @route POST /api/users/logout
 * @returns {NextResponse} - A response indicating the logout status.
 */
export const POST = async (): Promise<NextResponse> => {
  try {
    // Clear the 'token' cookie by setting it to empty and expired
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
    return response;
  } catch (err) {
    return sendError(
      new BadRequestError("Logout failed", "Unable to log out user")
    );
  }
};
