import mongoose from "mongoose";
import Itinerary, {
  IItinerary,
  ItineraryInput,
  ItineraryUpdateData,
} from "@/models/itineraryModel";
import { NotFoundError, BadRequestError } from "@/utils/customErrors";
import { validateObjectId } from "@/utils/helperRepository";

/**
 * Create a new itinerary
 * @param data - The itinerary data
 * @returns The created itinerary
 */
export async function createItinerary(
  data: ItineraryInput
): Promise<IItinerary> {
  try {
    const itinerary = await Itinerary.create(data);
    return itinerary;
  } catch (err) {
    throw new BadRequestError("Failed to create itinerary");
  }
}

/**
 * Get an itinerary by ID
 * @param id - The ID of the itinerary
 * @returns The itinerary object
 * @throws BadRequestError if the ID is invalid
 * @throws NotFoundError if the itinerary is not found
 */
export async function getItineraryById(id: string): Promise<IItinerary> {
  validateObjectId(id, "Invalid itinerary ID");
  const itinerary = await Itinerary.findById(id)
    .populate("createdBy", "username email")
    .populate("accommodations")
    .populate("pointsOfInterest")
    .exec();

  if (!itinerary) {
    throw new NotFoundError("Itinerary not found");
  }

  return itinerary;
}

/**
 * Update an itinerary by ID
 * @param id - The ID of the itinerary
 * @param data - The itinerary data to update
 * @returns The updated itinerary object
 * @throws BadRequestError if the ID is invalid
 * @throws NotFoundError if the itinerary is not found
 */
export async function updateItineraryById(
  id: string,
  data: ItineraryUpdateData
): Promise<IItinerary> {
  validateObjectId(id, "Invalid itinerary ID");
  const updatedItinerary = await Itinerary.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("createdBy", "username email")
    .populate("accommodations")
    .populate("pointsOfInterest")
    .exec();

  if (!updatedItinerary) {
    throw new NotFoundError("Itinerary not found");
  }

  return updatedItinerary;
}

/**
 * Delete an itinerary by ID
 * @param id - The ID of the itinerary
 * @returns The deleted itinerary object
 * @throws BadRequestError if the ID is invalid
 * @throws NotFoundError if the itinerary is not found
 */
export async function deleteItineraryById(id: string): Promise<IItinerary> {
  validateObjectId(id, "Invalid itinerary ID");

  const deletedItinerary = await Itinerary.findByIdAndDelete(id);

  if (!deletedItinerary) {
    throw new NotFoundError("Itinerary not found");
  }

  return deletedItinerary;
}

/**
 * Get all itineraries for a specific user
 * @param userId - The ID of the user
 * @param skip - The number of itineraries to skip (for pagination)
 * @param limit - The maximum number of documents to return
 * @returns A list of itineraries
 * @throws BadRequestError if the user ID is invalid
 */
export async function getAllItinerariesByUser(
  userId: string | mongoose.Types.ObjectId,
  skip = 0,
  limit = 10
): Promise<IItinerary[]> {
  validateObjectId(userId.toString(), "Invalid user ID");

  return await Itinerary.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("accommodations")
    .populate("pointsOfInterest");
}
