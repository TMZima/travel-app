import { NextRequest } from "next/server";
import { getUserItineraries } from "@/controllers/itineraryController";

/**
 * Handles the GET request to fetch all itineraries for a specific user.
 * Delegates the request to the 'getUserItineraries' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function GET(req: NextRequest): Promise<Response> {
  return await getUserItineraries(req);
}
