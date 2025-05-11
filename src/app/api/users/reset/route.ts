import { NextRequest } from "next/server";
import { resetPassword } from "@/controllers/userController";

/**
 * Handles the POST request to reset a user's password.
 * Delegates the request to the 'resetPassword' function in the controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function POST(req: NextRequest): Promise<Response> {
  return await resetPassword(req);
}
