import {
  createItinerary,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  getAllItinerariesByUser,
} from "@/repositories/itineraryRepository";
import { BadRequestError, NotFoundError } from "@/utils/customErrors";
import { IItinerary } from "@/models/itineraryModel";

export async function createItineraryService(
  data: Partial<IItinerary>
): Promise<IItinerary> {
  if (!data.destination || !data.startDate || !data.endDate) {
    throw new BadRequestError("Missing required fields");
  }
  // Optionally validate days/activities structure here
  return await createItinerary(data);
}

export async function getItineraryService(id: string): Promise<IItinerary> {
  const itinerary = await getItineraryById(id);
  if (!itinerary) throw new NotFoundError("Itinerary not found");
  return itinerary;
}

export async function updateItineraryService(
  id: string,
  data: Partial<IItinerary>
): Promise<IItinerary> {
  if (data.days) {
    // Optionally validate days/activities structure here
  }
  const updated = await updateItineraryById(id, data);
  if (!updated) throw new NotFoundError("Itinerary not found");
  return updated;
}

export async function deleteItineraryService(id: string): Promise<void> {
  await deleteItineraryById(id);
}

export async function getUserItinerariesService(
  userId: string
): Promise<IItinerary[]> {
  return await getAllItinerariesByUser(userId);
}
