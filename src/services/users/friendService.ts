import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
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

  if (!ObjectId.isValid(friendId)) {
    throw new BadRequestError("Invalid friend ID format");
  }

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  const friendObjectId = new ObjectId(friendId);

  if (user.friends.some((id: ObjectId) => id.equals(friendObjectId)))
    throw new ConflictError("Friend already exists");

  user.friends.push(friendObjectId);
  await user.save();

  return { message: "Friend added successfully" };
}

// --- Remove Friend ---
export async function removeFriendService(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromUrl(req);
  const { friendId }: FriendRequestBody = await req.json();

  if (!friendId) throw new BadRequestError("Friend ID is required");

  if (!ObjectId.isValid(friendId)) {
    throw new BadRequestError("Invalid friend ID format");
  }

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  const friendObjectId = new ObjectId(friendId);

  if (!user.friends.some((id: ObjectId) => id.equals(friendObjectId))) {
    throw new NotFoundError("Friend not found");
  }

  user.friends = user.friends.filter(
    (id: ObjectId) => !id.equals(friendObjectId)
  );
  await user.save();

  return { message: "Friend removed successfully" };
}
