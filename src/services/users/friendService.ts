import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/config/db";
import { findUserById, updateUserById } from "@/repositories/userRepository";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@/utils/customErrors";
import { getUserIdFromRequest } from "@/utils/auth";

// --- Interfaces ---
interface FriendRequestBody {
  friendId: string;
}

/**
 * Get a user's friends
 * @param req - The Next.js request object
 * @returns An object containing the user's friends
 * @throws NotFoundError if the user is not found
 */
export async function getFriendsService(
  req: NextRequest
): Promise<{ friends: ObjectId[] }> {
  await dbConnect();
  const userId = await getUserIdFromRequest(req, process.env.JWT_SECRET!);
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");
  return { friends: user.friends };
}

/**
 * Add a friend to the user's friend list
 * @param req - The Next.js request object
 * @returns A success message
 * @throws BadRequestError if the friend ID is missing or invalid
 * @throws NotFoundError if the user is not found
 * @throws ConflictError if the friend already exists
 */
export async function addFriendService(
  req: NextRequest
): Promise<{ message: string }> {
  await dbConnect();
  const userId = await getUserIdFromRequest(req, process.env.JWT_SECRET!);
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
  await updateUserById(userId, { friends: user.friends });

  return { message: "Friend added successfully" };
}

/**
 * Remove a friend from a user's friend list
 * @param req - The Next.js request object
 * @returns A success message
 * @throws BadRequestError if the friend ID is missing or invalid
 * @throws NotFoundError if the user or friend is not found
 */
export async function removeFriendService(
  req: NextRequest
): Promise<{ message: string }> {
  await dbConnect();
  const userId = await getUserIdFromRequest(req, process.env.JWT_SECRET!);
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
  await updateUserById(userId, { friends: user.friends });

  return { message: "Friend removed successfully" };
}
