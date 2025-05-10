import Accommodation, { IAccommodation } from "@/models/accommodationModel";
import { NotFoundError } from "@/utils/customErrors";
import { validateObjectId } from "@/utils/helperRepository";

/**
 * Create a new accommodation
 * @param data - Partial accommodation data
 * @returns The created accommodation
 */
export async function createAccommodation(
  data: Partial<IAccommodation>
): Promise<IAccommodation> {
  return await Accommodation.create(data);
}

/**
 * Fetch an accommodation by its ID
 * @param id - The ID of the accommodation
 * @returns The accommodation object or null if not found
 * @Throws BadRequestError if the ID is invalid
 * @Throws NotFoundError if the accommodation is not found
 */
export async function getAccommodationById(
  id: string
): Promise<IAccommodation | null> {
  validateObjectId(id, "Invalid accommodation ID");

  const accommodation = await Accommodation.findById(id)
    .populate("belongsTo", "title startDate endDate")
    .exec();

  if (!accommodation) {
    throw new NotFoundError("Accommodation not found");
  }
  return accommodation;
}

/**
 * Update an accommodation by its ID
 * @param id - The ID of the accommodation
 * @param data - Partial accommodation data to update
 * @returns The updated accommodation object or null if not found
 * @throws BadRequestError if the ID is invalid
 * @throws NotFoundError if the accommodation is not found
 */
export async function updateAccommodationById(
  id: string,
  data: Partial<IAccommodation>
): Promise<IAccommodation | null> {
  validateObjectId(id, "Invalid accommodation ID");

  const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("belongsTo", "title startDate endDate")
    .exec();

  if (!updatedAccommodation) {
    throw new NotFoundError("Accommodation not found");
  }
  return updatedAccommodation;
}

/**
 * Delete an accommodation by its ID
 * @param id - The ID of the accommodation
 * @returns The deleted accommodation object
 * @throws BadRequestError if the ID is invalid
 * @throws NotFoundError if the accommodation is not found
 */
export async function deleteAccommodationById(
  id: string
): Promise<IAccommodation | null> {
  validateObjectId(id, "Invalid accommodation ID");

  const deletedAccommodation = await Accommodation.findByIdAndDelete(id).exec();

  if (!deletedAccommodation) {
    throw new NotFoundError("Accommodation not found");
  }
  return deletedAccommodation;
}

/**
 * Fetch all accommodations for a specific itinerary
 * @param itineraryId - The ID of the itinerary
 * @param skip - Number of documents to skip (for pagination)
 * @param limit - Maximum number of documents to return
 * @returns A list of accommodations
 * @throws BadRequestError if the ID is invalid
 */
export async function getAllAccommodationsByItineraryId(
  itineraryId: string,
  skip: number,
  limit: number
): Promise<IAccommodation[]> {
  validateObjectId(itineraryId, "Invalid itinerary ID");

  return await Accommodation.find({ belongsTo: itineraryId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
}

/**
 * Fetch all accommodations created by a specific user
 * @param userId - The ID of the user
 * @param skip - Number of documents to skip (for pagination)
 * @param limit - Maximum number of documents to return
 * @returns A list of accommodations
 * @throws BadRequestError if the ID is invalid
 */
export async function getAllAccommodationsByUser(
  userId: string,
  skip: number,
  limit: number
): Promise<IAccommodation[]> {
  validateObjectId(userId, "Invalid user ID");

  return await Accommodation.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
}
