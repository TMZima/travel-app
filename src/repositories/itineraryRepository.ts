import Itinerary, { IItinerary } from "@/models/itineraryModel";
import { NotFoundError, BadRequestError } from "@/utils/customErrors";
import { validateObjectId } from "@/utils/helperRepository";
import { dbConnect } from "@/config/db"; // <-- import your dbConnect

/**
 * Create a new itinerary
 */
export async function createItinerary(
  data: Partial<IItinerary>
): Promise<IItinerary> {
  await dbConnect(); // <-- add this
  try {
    const itinerary = await Itinerary.create(data);
    return itinerary;
  } catch (err) {
    throw new BadRequestError("Failed to create itinerary");
  }
}

/**
 * Get an itinerary by ID
 */
export async function getItineraryById(id: string): Promise<IItinerary | null> {
  await dbConnect(); // <-- add this
  validateObjectId(id, "Invalid itinerary ID");
  const itinerary = await Itinerary.findById(id).exec();
  if (!itinerary) throw new NotFoundError("Itinerary not found");
  return itinerary;
}

/**
 * Update an itinerary by ID
 */
export async function updateItineraryById(
  id: string,
  data: Partial<IItinerary>
): Promise<IItinerary | null> {
  await dbConnect(); // <-- add this
  validateObjectId(id, "Invalid itinerary ID");
  const updated = await Itinerary.findByIdAndUpdate(id, data, {
    new: true,
  }).exec();
  if (!updated) throw new NotFoundError("Itinerary not found");
  return updated;
}

/**
 * Delete an itinerary by ID
 */
export async function deleteItineraryById(id: string): Promise<void> {
  await dbConnect(); // <-- add this
  validateObjectId(id, "Invalid itinerary ID");
  const deleted = await Itinerary.findByIdAndDelete(id).exec();
  if (!deleted) throw new NotFoundError("Itinerary not found");
}

/**
 * Get all itineraries for a user
 */
export async function getAllItinerariesByUser(
  userId: string
): Promise<IItinerary[]> {
  await dbConnect(); // <-- add this
  validateObjectId(userId, "Invalid user ID");
  return Itinerary.find({ createdBy: userId }).sort({ startDate: 1 }).exec();
}
