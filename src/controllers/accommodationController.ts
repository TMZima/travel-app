import { NextRequest, NextResponse } from "next/server";
import {
  createAccommodationService,
  getAccommodationService,
  updateAccommodationService,
  deleteAccommodationService,
  getAllAccommodationsByItineraryIdService,
  getAllAccommodationsByUserService,
} from "@/services/accommodations/accommodationService";
import { sendSuccess, sendError } from "@/utils/apiResponse";
import { BadRequestError } from "@/utils/customErrors";

/**
 * Create a new accommodation
 * @param req - The incoming HTTP request
 * @returns A JSON response with the created accommodation
 */
export async function createAccommodation(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const data = await req.json();
    const accommodation = await createAccommodationService(data);
    return sendSuccess(
      accommodation,
      201,
      "Accommodation created successfully"
    );
  } catch (err) {
    console.error("Error in createAccommodation:", err);
    return sendError(err);
  }
}

/**
 * Get an accommodation by ID
 * @param req - The incoming HTTP request
 * @param context - The request context containing route parameters
 * @returns A JSON response with the accommodation details
 */
export async function getAccommodation(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    if (!id) throw new BadRequestError("Missing accommodation ID");

    const accommodation = await getAccommodationService(id);
    return sendSuccess(
      accommodation,
      200,
      "Accommodation fetched successfully"
    );
  } catch (err) {
    console.error("Error in getAccommodation:", err);
    return sendError(err);
  }
}

/**
 * Update an accommodation by ID
 * @param req - The incoming HTTP request
 * @param context - The request context containing route parameters
 * @returns A JSON response with the updated accommodation
 */
export async function updateAccommodation(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    const data = await req.json();
    const updatedAccommodation = await updateAccommodationService(id, data);
    return sendSuccess(
      updatedAccommodation,
      200,
      "Accommodation updated successfully"
    );
  } catch (err) {
    console.error("Error in updateAccommodation:", err);
    return sendError(err);
  }
}

/**
 * Delete an accommodation by ID
 * @param req - The incoming HTTP request
 * @param context - The request context containing route parameters
 * @returns A JSON response with the success message
 */
export async function deleteAccommodation(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    if (!id) throw new BadRequestError("Missing accommodation ID");

    const response = await deleteAccommodationService(id);
    return sendSuccess(response, 200, "Accommodation deleted successfully");
  } catch (err) {
    console.error("Error in deleteAccommodation:", err);
    return sendError(err);
  }
}

/**
 * Get all accommodations for a specific itinerary
 * @param req - The incoming HTTP request
 * @returns A JSON response with the accommodations for the specified itinerary
 */
export async function getAccommodationsByItinerary(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const itineraryId = searchParams.get("itineraryId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!itineraryId) throw new BadRequestError("Missing itinerary ID");

    const accommodations = await getAllAccommodationsByItineraryIdService(
      itineraryId,
      page,
      limit
    );
    return sendSuccess(
      accommodations,
      200,
      "Accommodations fetched successfully"
    );
  } catch (err) {
    console.error("Error in getAccommodationsByItinerary:", err);
    return sendError(err);
  }
}

/**
 * Get all accommodations created by a specific user
 * @param req - The incoming HTTP request
 * @returns A JSON response with the accommodations created by the user
 */
export async function getAccommodationsByUser(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!userId) throw new BadRequestError("Missing user ID");

    const accommodations = await getAllAccommodationsByUserService(
      userId,
      page,
      limit
    );
    return sendSuccess(
      accommodations,
      200,
      "User accommodations fetched successfully"
    );
  } catch (err) {
    console.error("Error in getAccommodationsByUser:", err);
    return sendError(err);
  }
}
