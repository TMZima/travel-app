import { NextRequest, NextResponse } from "next/server";
import {
  getItinerary,
  updateItinerary,
  deleteItinerary,
} from "@/controllers/itineraryController";

/**
 * GET /api/itinerary/[id]
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response with the itinerary details
 */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return getItinerary(req, context);
}

/**
 * PUT /api/itinerary/[id]
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response after updating the itinerary
 */
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return updateItinerary(req, context);
}

/**
 * DELETE /api/itinerary/[id]
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response after deleting the itinerary
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return deleteItinerary(req, context);
}
