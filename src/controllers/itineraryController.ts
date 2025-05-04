import { NextRequest } from "next/server";
import {
  createItineraryService,
  getItineraryService,
  updateItineraryService,
  deleteItineraryService,
  getAllItinerariesService,
} from "@/services/itineraries/itineraryService";
import { sendSuccess, sendError } from "@/utils/apiResponse";
import { BadRequestError } from "@/utils/customErrors";

export async function createItinerary(req: NextRequest) {
  try {
    const data = await req.json();
    const itinerary = await createItineraryService(data);
    return sendSuccess(itinerary, 201);
  } catch (err) {
    console.error("Error in createItinerary:", err);
    return sendError(err);
  }
}

export async function getItinerary(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) throw new BadRequestError("Missing itinerary ID");

    const itinerary = await getItineraryService(id);
    return sendSuccess(itinerary, 200);
  } catch (err) {
    console.error("Error in getItinerary:", err);
    return sendError(err);
  }
}

export async function updateItinerary(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const data = await req.json();
    const updatedItinerary = await updateItineraryService(id, data);
    return sendSuccess(updatedItinerary, 200);
  } catch (err) {
    console.error("Error in updateItinerary:", err);
    return sendError(err);
  }
}

export async function deleteItinerary(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) throw new BadRequestError("Missing itinerary ID");

    await deleteItineraryService(id);
    return sendSuccess({ message: "Itinerary deleted successfully" }, 200);
  } catch (err) {
    console.error("Error in deleteItinerary:", err);
    return sendError(err);
  }
}

export async function getUserItineraries(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!userId) throw new BadRequestError("Missing userId");

    const itineraries = await getAllItinerariesService(userId, page, limit);
    return sendSuccess(itineraries, 200);
  } catch (err) {
    console.error("Error in getUserItineraries:", err);
    return sendError(err);
  }
}
