import { NextRequest } from "next/server";
import { createAccommodation } from "@/controllers/accommodationController";

/**
 * Handles the POST request to create a new accommodation.
 * Delegates the request to the 'createAccommodation' function in the controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export default async function POST(req: NextRequest): Promise<Response> {
  return await createAccommodation(req);
}
