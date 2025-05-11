import { NextRequest } from "next/server";
import { loginUser } from "@/controllers/userController";

/**
 * Handles the POST request to log in a user.
 * Delegates the request to the 'loginUser' function in the controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function POST(req: NextRequest): Promise<Response> {
  return await loginUser(req);
}
