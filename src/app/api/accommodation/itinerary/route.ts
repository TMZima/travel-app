import { NextRequest } from "next/server";
import { getAccommodationsByItinerary } from "@/controllers/accommodationController";

/**
 * Handles the GET request to fetch accommodations associated with a specific itinerary.
 * Delegates the request to the 'getAccommodationsByItinerary' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export const GET = async (req: NextRequest): Promise<Response> => {
  return await getAccommodationsByItinerary(req);
};
