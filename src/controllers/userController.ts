import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { sendError, sendSuccess } from "@/utils/apiResponse";
import {
  registerUserService,
  getUserService,
  updateUserService,
  deleteUserService,
} from "@/services/users/userService";
import { loginUserService } from "@/services/users/authService";
import { getUserIdFromRequest } from "@/utils/auth";

/**
 * Register a new user
 * @param req - The incoming HTTP request
 * @returns A JSON response with the user object and a token cookie
 */
export async function registerUser(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { token, user } = await registerUserService(body);

    const response = sendSuccess(user, 201, "User registered successfully");

    response.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      })
    );

    return response;
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Login a user
 * @param req - The incoming HTTP request
 * @returns A JSON response with the user object and a token cookie
 */
export async function loginUser(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { token, user } = await loginUserService(body);

    const response = sendSuccess(user, 200, "User logged in successfully");

    response.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      })
    );
    return response;
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Get a user's details
 * @param req - The incoming HTTP request
 * @returns A JSON response with the user's details
 */
export async function getUser(req: NextRequest): Promise<NextResponse> {
  try {
    const response = await getUserService(req);
    return sendSuccess(response, 200, "User fetched successfully");
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Update a user's details
 * @param req - The incoming HTTP request
 * @returns A JSON response with the updated user's details
 */
export async function updateUser(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getUserIdFromRequest(req, process.env.JWT_SECRET!);
    const body = await req.json();
    const response = await updateUserService(userId, body);
    return sendSuccess(response, 200, "User updated successfully");
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Delete a user
 * @param req - The incoming HTTP request
 * @returns A JSON response with the success message
 */
export async function deleteUser(req: NextRequest): Promise<NextResponse> {
  try {
    const response = await deleteUserService(req);
    return sendSuccess(response, 200, "User deleted successfully");
  } catch (err) {
    return sendError(err);
  }
}
