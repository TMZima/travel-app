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
export const GET: (
  req: NextRequest,
  context: { params: { id: string } }
) => Promise<NextResponse> = getItinerary;

/**
 * PUT /api/itinerary/[id]
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response after updating the itinerary
 */
export const PUT: (
  req: NextRequest,
  context: { params: { id: string } }
) => Promise<NextResponse> = updateItinerary;

/**
 * DELETE /api/itinerary/[id]
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response after deleting the itinerary
 */
export const DELETE: (
  req: NextRequest,
  context: { params: { id: string } }
) => Promise<NextResponse> = deleteItinerary;
