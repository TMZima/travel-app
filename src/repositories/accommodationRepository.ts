import Accommodation, { IAccommodation } from "@/models/accommodationModel";

/**
 * Create a new accommodation
 */
export async function createAccommodation(data: Partial<IAccommodation>) {
  return await Accommodation.create(data);
}

/**
 * Fetch an accommodation by its ID
 */
export async function getAccommodationById(id: string) {
  return await Accommodation.findById(id)
    .populate("belongsTo", "title startDate endDate")
    .exec();
}

/**
 * Update an accommodation by its ID
 */
export async function updateAccommodationById(
  id: string,
  data: Partial<IAccommodation>
) {
  return await Accommodation.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("belongsTo", "title startDate endDate")
    .exec();
}

/**
 * Delete an accommodation by its ID
 */
export async function deleteAccommodationById(id: string) {
  return await Accommodation.findByIdAndDelete(id).exec();
}

/**
 * Fetch all accommodations for a specific itinerary
 */
export async function getAllAccommodationsByItineraryId(
  itineraryId: string,
  skip = 0,
  limit = 10
) {
  return await Accommodation.find({ belongsTo: itineraryId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
}

/**
 * Fetch all accommodations created by a specific user
 */
export async function getAllAccommodationsByUser(
  userId: string,
  skip = 0,
  limit = 10
) {
  return await Accommodation.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
}
