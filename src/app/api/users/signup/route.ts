import { NextRequest } from "next/server";
import { registerUser } from "@/controllers/userController";

/**
 * Handles the POST request to register a new user.
 * Delegates the request to the 'registerUser' function in the controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function POST(req: NextRequest): Promise<Response> {
  return await registerUser(req);
}
