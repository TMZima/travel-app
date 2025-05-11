import { NextRequest } from "next/server";
import { createItinerary } from "@/controllers/itineraryController";

/**
 * Handles the POST request to create a new itinerary.
 * Delegates the request to the 'createItinerary' function in the controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function POST(req: NextRequest): Promise<Response> {
  return await createItinerary(req);
}
