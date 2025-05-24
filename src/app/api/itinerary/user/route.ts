import { NextRequest } from "next/server";
import { getUserItineraries } from "@/controllers/itineraryController";

/**
 * Handles the GET request to fetch all itineraries for a specific user.
 * Delegates the request to the 'getUserItineraries' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export const GET = async (req: NextRequest): Promise<Response> => {
  return getUserItineraries(req);
};
