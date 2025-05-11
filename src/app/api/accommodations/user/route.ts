import { NextRequest } from "next/server";
import { getAccommodationsByUser } from "@/controllers/accommodationController";

/**
 * Handles the GET request to fetch accommodations created by a specific user.
 * Delegates the request to the 'getAccommodationsByUser' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export default async function GET(req: NextRequest): Promise<Response> {
  return await getAccommodationsByUser(req);
}
