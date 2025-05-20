import {
  IItinerary,
  ItineraryInput,
  ItineraryUpdateData,
} from "@/models/itineraryModel";
import {
  createItinerary,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  getAllItinerariesByUser,
} from "@/repositories/itineraryRepository";
import { BadRequestError, NotFoundError } from "@/utils/customErrors";

/**
 * Create a new itinerary
 */
export async function createItineraryService(
  data: ItineraryInput
): Promise<IItinerary> {
  if (!data.title || !data.startDate || !data.endDate || !data.createdBy) {
    throw new BadRequestError("Please provide all required fields");
  }

  return await createItinerary(data);
}

/**
 * Fetch an itinerary by its ID
 */
export async function getItineraryService(id: string): Promise<IItinerary> {
  const itinerary = await getItineraryById(id);
  if (!itinerary) {
    throw new NotFoundError("The requested itinerary could not be found");
  }
  return itinerary;
}

export async function updateItineraryService(
  id: string,
  data: ItineraryUpdateData
): Promise<IItinerary> {
  const updatedItinerary = await updateItineraryById(id, data);
  if (!updatedItinerary) {
    throw new NotFoundError(
      "The itinerary you are trying to update does not exist"
    );
  }
  return updatedItinerary;
}

/**
 * Delete an itinerary by its ID
 */
export async function deleteItineraryService(
  id: string
): Promise<{ message: string }> {
  const deletedItinerary = await deleteItineraryById(id);
  if (!deletedItinerary) {
    throw new NotFoundError(
      "The itinerary you are trying to delete does not exist"
    );
  }
  return { message: "Itinerary deleted successfully" };
}

/**
 * Fetch all itineraries for a specific user
 * @param userId - The ID of the user
 * @param page - The page number for pagination
 * @param limit - The number of itineraries to fetch per page
 * @returns An array of itineraries
 */
export async function getAllItinerariesService(
  userId: string,
  page: number,
  limit: number
): Promise<IItinerary[]> {
  const skip = (page - 1) * limit;
  const itineraries = await getAllItinerariesByUser(userId, skip, limit);
  return itineraries || [];
}
