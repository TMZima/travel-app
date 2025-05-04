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

export async function registerUser(req: NextRequest) {
  try {
    const { token, user } = await registerUserService(req);

    const response = NextResponse.json({ user });

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

    return NextResponse.redirect(new URL("/", req.url));
  } catch (err) {
    return sendError(err);
  }
}

export async function loginUser(req: NextRequest) {
  try {
    const { token, user } = await loginUserService(req);

    const response = NextResponse.json({ user });

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
    return sendSuccess({ user }, 200);
  } catch (err) {
    return sendError(err);
  }
}

export async function resetPassword(req: NextRequest) {
  try {
    const response = await resetPasswordService(req);
    return sendSuccess(response, 200);
  } catch (err) {
    return sendError(err);
  }
}

export async function getUser(req: NextRequest) {
  try {
    const response = await getUserService(req);
    return sendSuccess(response, 200);
  } catch (err) {
    return sendError(err);
  }
}

export async function updateUser(req: NextRequest) {
  try {
    const response = await updateUserService(req);
    return sendSuccess(response, 200);
  } catch (err) {
    return sendError(err);
  }
}

export async function deleteUser(req: NextRequest) {
  try {
    const response = await deleteUserService(req);
    return sendSuccess(response, 200);
  } catch (err) {
    return sendError(err);
  }
}

export async function getFriends(req: NextRequest) {
  try {
    const response = await getFriendsService(req);
    return sendSuccess(response, 200);
  } catch (err) {
    return sendError(err);
  }
}

export async function addFriend(req: NextRequest) {
  try {
    const response = await addFriendService(req);
    return sendSuccess(response, 200);
  } catch (err) {
    return sendError(err);
  }
}

export async function removeFriend(req: NextRequest) {
  try {
    const response = await removeFriendService(req);
    return sendSuccess(response, 200);
  } catch (err) {
    return sendError(err);
  }
}
