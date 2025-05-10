import mongoose from "mongoose";
import Itinerary, {
  ItineraryData,
  ItineraryUpdateData,
} from "@/models/itineraryModel";

/**
 * Create a new itinerary
 */
export async function createItinerary(data: ItineraryData) {
  return await Itinerary.create(data);
}

/**
 * Get an itinerary by ID
 */
export async function getItineraryById(id: string) {
  return await Itinerary.findById(id)
    .populate("createdBy", "username email")
    .populate("accommodations")
    .populate("pointsOfInterest");
}

/**
 * Update an itinerary by ID
 */
export async function updateItineraryById(
  id: string,
  data: ItineraryUpdateData
) {
  return await Itinerary.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("createdBy", "username email")
    .populate("accommodations")
    .populate("pointsOfInterest");
}

/**
 * Delete an itinerary by ID
 */
export async function deleteItineraryById(id: string) {
  return await Itinerary.findByIdAndDelete(id);
}

/**
 * Get all itineraries for a specific user
 */
export async function getAllItinerariesByUser(
  userId: string | mongoose.Types.ObjectId,
  skip = 0,
  limit = 10
) {
  return await Itinerary.find({ createdBy: userId })
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limit)
    .populate("accommodations")
    .populate("pointsOfInterest");
}
