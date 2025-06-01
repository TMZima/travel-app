import { NextRequest, NextResponse } from "next/server";
import {
  createItineraryService,
  getItineraryService,
  updateItineraryService,
  deleteItineraryService,
  getUserItinerariesService,
} from "@/services/itineraries/itineraryService";
import { sendSuccess, sendError } from "@/utils/apiResponse";
import { getUserFromToken } from "@/utils/auth";
import { BadRequestError } from "@/utils/customErrors";

/**
 * Create a new itinerary
 */
export async function createItinerary(req: NextRequest): Promise<NextResponse> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return sendError(new BadRequestError("Unauthorized"));
    const user = await getUserFromToken(token, process.env.JWT_SECRET!);
    if (!user) return sendError(new BadRequestError("Unauthorized"));

    const data = await req.json();
    const itinerary = await createItineraryService({
      ...data,
      createdBy: user.id || user._id,
    });

    return sendSuccess(itinerary, 201, "Itinerary created successfully");
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Get a single itinerary by ID
 */
export async function getItinerary(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const itinerary = await getItineraryService(id);
    return sendSuccess(itinerary, 200, "Itinerary fetched successfully");
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Update an itinerary by ID
 */
export async function updateItinerary(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const data = await req.json();
    const updated = await updateItineraryService(id, data);
    return sendSuccess(updated, 200, "Itinerary updated successfully");
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Delete an itinerary by ID
 */
export async function deleteItinerary(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await deleteItineraryService(id);
    return sendSuccess(null, 200, "Itinerary deleted successfully");
  } catch (err) {
    return sendError(err);
  }
}

/**
 * Get all itineraries for the logged-in user
 */
export async function getUserItineraries(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return sendError(new BadRequestError("Unauthorized"));
    const user = await getUserFromToken(token, process.env.JWT_SECRET!);
    if (!user) return sendError(new BadRequestError("Unauthorized"));

    const itineraries = await getUserItinerariesService(
      String(user.id || user._id)
    );
    return sendSuccess(
      itineraries,
      200,
      "User itineraries fetched successfully"
    );
  } catch (err) {
    return sendError(err);
  }
}
