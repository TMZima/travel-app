import { NextRequest } from "next/server";
import { getUser, updateUser, deleteUser } from "@/controllers/userController";

/**
 * Handles the GET request to fetch a user by ID.
 * Delegates the request to the 'getUser' function in the controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function GET(req: NextRequest): Promise<Response> {
  return await getUser(req);
}

/**
 * Handles the PUT request to update a user by ID.
 * Delegates the request to the 'updateUser' function in the controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function PUT(req: NextRequest): Promise<Response> {
  return await updateUser(req);
}

/**
 * Handles the DELETE request to delete a user by ID.
 * Delegates the request to the 'deleteUser' function in the controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function DELETE(req: NextRequest): Promise<Response> {
  return await deleteUser(req);
}
