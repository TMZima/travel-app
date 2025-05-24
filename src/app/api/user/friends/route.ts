import { NextRequest } from "next/server";
import {
  getFriends,
  addFriend,
  removeFriend,
} from "@/controllers/userController";

/**
 * Handles the GET request to fetch a user's friends.
 * Delegates the request to the 'getFriends' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export const GET = async (req: NextRequest): Promise<Response> => {
  return getFriends(req);
};

/**
 * Handles the POST request to add a friend.
 * Delegates the request to the 'addFriend' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export const POST = async (req: NextRequest): Promise<Response> => {
  return addFriend(req);
};

/**
 * Handles the DELETE request to remove a friend.
 * Delegates the request to the 'removeFriend' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export const DELETE = async (req: NextRequest): Promise<Response> => {
  return removeFriend(req);
};
