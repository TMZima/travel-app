import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { sendError, sendSuccess } from "@/utils/apiResponse";
import {
  registerUserService,
  getUserService,
  updateUserService,
  deleteUserService,
} from "@/services/users/userService";
import {
  loginUserService,
  resetPasswordService,
} from "@/services/users/authService";
import {
  getFriendsService,
  addFriendService,
  removeFriendService,
} from "@/services/users/friendService";
import { getUserIdFromUrl } from "@/utils/helperService";

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
 * Reset a user's password
 * @param req - The incoming HTTP request
 * @returns A JSON response with the success message
 */
export async function resetPassword(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const response = await resetPasswordService(body);
    return sendSuccess(response, 200, "Password reset successfully");
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
    const userId = getUserIdFromUrl(req);
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

/**
 * Get a user's friends
 * @param req - The incoming HTTP request
 * @returns A JSON response with the user's friends
 */
export async function getFriends(req: NextRequest): Promise<NextResponse> {
  try {
    const response = await getFriendsService(req);
    return sendSuccess(response, 200, "Friends fetched successfully");
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Add a friend
 * @param req - The incoming HTTP request
 * @returns A JSON response with the success message
 */
export async function addFriend(req: NextRequest): Promise<NextResponse> {
  try {
    const response = await addFriendService(req);
    return sendSuccess(response, 200, "Friend added successfully");
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Remove a friend
 * @param req - The incoming HTTP request
 * @returns A JSON response with the success message
 */
export async function removeFriend(req: NextRequest): Promise<NextResponse> {
  try {
    const response = await removeFriendService(req);
    return sendSuccess(response, 200, "Friend removed successfully");
  } catch (err) {
    return sendError(err);
  }
}
