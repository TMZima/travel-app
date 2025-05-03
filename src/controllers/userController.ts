import { NextRequest } from "next/server";
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
    const response = await registerUserService(req);
    return sendSuccess(response, 201);
  } catch (err) {
    return sendError(err);
  }
}

export async function loginUser(req: NextRequest) {
  try {
    const response = await loginUserService(req);
    return sendSuccess(response, 200);
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
