import { NextRequest } from "next/server";
import { dbConnect } from "@/config/db";
import { findUserById } from "@/repositories/userRepository";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@/utils/customErrors";
import { getUserIdFromUrl } from "@/services/users/helperService";

// --- Interfaces ---
interface FriendRequestBody {
  friendId: string;
}

// --- Get Friends ---
export async function getFriendsService(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromUrl(req);

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  return { friends: user.friends };
}

// --- Add Friend ---
export async function addFriendService(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromUrl(req);
  const { friendId }: FriendRequestBody = await req.json();

  if (!friendId) throw new BadRequestError("Friend ID is required");

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  if (user.friends.includes(friendId)) {
    throw new ConflictError("Already friends");
  }

  user.friends.push(friendId);
  await user.save();

  return { message: "Friend added successfully" };
}

// --- Remove Friend ---
export async function removeFriendService(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromUrl(req);
  const { friendId }: FriendRequestBody = await req.json();

  if (!friendId) throw new BadRequestError("Friend ID is required");

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  if (!user.friends.includes(friendId)) {
    throw new NotFoundError("Friend not found");
  }

  user.friends = user.friends.filter((id: string) => id !== friendId);
  await user.save();

  return { message: "Friend removed successfully" };
}
