import { NextRequest } from "next/server";
import {
  getItinerary,
  updateItinerary,
  deleteItinerary,
} from "@/controllers/itineraryController";

/**
 * Handles the GET request to fetch an itinerary by ID.
 * @param {NextRequest} req - The incoming HTTP request object.
 * @param {{ params: { id: string } }} context - The request context containing route parameters.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  return await getItinerary(req, context);
}

/**
 * Handles the PUT request to update an itinerary by ID.
 * Delegates the request to the 'updateItinerary' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @param {{ params: { id: string } }} context - The request context containing route parameters.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  return await updateItinerary(req, context);
}

/**
 * Handles the DELETE request to remove an itinerary by ID.
 * Delegates the request to the 'deleteItinerary' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @param {{ params: { id: string } }} context - The request context containing route parameters.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  return await deleteItinerary(req, context);
}
