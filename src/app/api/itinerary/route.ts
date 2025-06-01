import { NextRequest, NextResponse } from "next/server";
import {
  createItinerary,
  getUserItineraries,
} from "@/controllers/itineraryController";

/**
 * POST /api/itinerary
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response after creating an itinerary
 */
export const POST: (req: NextRequest) => Promise<NextResponse> =
  createItinerary;

/**
 * GET /api/itinerary/user
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} The response with the user's itineraries
 */
export const GET: (req: NextRequest) => Promise<NextResponse> =
  getUserItineraries;
