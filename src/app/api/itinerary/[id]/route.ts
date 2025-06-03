import { NextRequest } from "next/server";
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
  { params }: { params: { id: string } }
) {
  return getItinerary(req, { params });
}

/**
 * PUT /api/itinerary/[id]
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response after updating the itinerary
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateItinerary(req, { params });
}

/**
 * DELETE /api/itinerary/[id]
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response after deleting the itinerary
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteItinerary(req, { params });
}
