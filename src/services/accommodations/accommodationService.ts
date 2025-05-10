import {
  createAccommodation,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodationById,
  getAllAccommodationsByItineraryId,
  getAllAccommodationsByUser,
} from "@/repositories/accommodationRepository";
import { BadRequestError, NotFoundError } from "@/utils/customErrors";
import { IAccommodation } from "@/models/accommodationModel";

/**
 * Create a new accommodation
 */
export async function createAccommodationService(
  data: Partial<IAccommodation>
): Promise<IAccommodation> {
  if (
    !data.name ||
    !data.type ||
    !data.checkInDate ||
    !data.checkOutDate ||
    !data.belongsTo ||
    !data.createdBy
  )
    throw new BadRequestError(
      "Missing required fields",
      "Please provide all required fields"
    );

  if (new Date(data.checkInDate) > new Date(data.checkOutDate)) {
    throw new BadRequestError(
      "Invalid dates",
      "Check-in date cannot be after check-out date"
    );
  }

  return await createAccommodation(data);
}

/**
 * Fetch an accommodation by its ID
 */
export async function getAccommodationService(
  id: string
): Promise<IAccommodation> {
  const accommodation = await getAccommodationById(id);
  if (!accommodation) {
    throw new NotFoundError(
      "Accommodation not found",
      "The requested accommodation could not be found"
    );
  }

  return accommodation;
}

/**
 * Update an accommodation by its ID
 */
export async function updateAccommodationService(
  id: string,
  data: Partial<IAccommodation>
): Promise<IAccommodation> {
  const updatedAccommodation = await updateAccommodationById(id, data);
  if (!updatedAccommodation) {
    throw new NotFoundError(
      "Accommodation not found",
      "The accommodation you are trying to update does not exist"
    );
  }

  return updatedAccommodation;
}

/**
 * Delete an accommodation by its ID
 */
export async function deleteAccommodationService(
  id: string
): Promise<{ message: string }> {
  const deletedAccommodation = await deleteAccommodationById(id);
  if (!deletedAccommodation) {
    throw new NotFoundError(
      "Accommodation not found",
      "The accommodation you are trying to delete does not exist"
    );
  }

  return { message: "Accommodation deleted successfully" };
}

/**
 * Fetch all accommodations for a specific itinerary
 * @param itineraryId - The ID of the itinerary
 * @param page - The current page number (for pagination)
 * @param limit - The number of items per page (for pagination)
 * @returns A list of accommodations for the specified itinerary
 */
export async function getAllAccommodationsByItineraryIdService(
  itineraryId: string,
  page = 1,
  limit = 10
): Promise<IAccommodation[]> {
  const skip = (page - 1) * limit;
  const accommodations = await getAllAccommodationsByItineraryId(
    itineraryId,
    skip,
    limit
  );
  if (!accommodations || accommodations.length === 0) {
    throw new NotFoundError(
      "No accommodations found",
      "No accommodations were found for the specified itinerary"
    );
  }

  return accommodations;
}

/**
 * Fetch all accommodations created by a specific user
 * @param userId - The ID of the user
 * @param page - The current page number (for pagination)
 * @param limit - The number of items per page (for pagination)
 * @returns A list of accommodations for the specified user
 */
export async function getAllAccommodationsByUserService(
  userId: string,
  page = 1,
  limit = 10
): Promise<IAccommodation[]> {
  const skip = (page - 1) * limit;
  const accommodations = await getAllAccommodationsByUser(userId, skip, limit);
  if (!accommodations || accommodations.length === 0) {
    throw new NotFoundError(
      "No accommodations found",
      "No accommodations were found for the specified user"
    );
  }

  return accommodations;
}
