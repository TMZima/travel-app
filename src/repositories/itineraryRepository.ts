import mongoose from "mongoose";
import Itinerary, {
  ItineraryData,
  ItineraryUpdateData,
} from "@/models/itineraryModel";

export async function createItinerary(data: ItineraryData) {
  return await Itinerary.create(data);
}

export async function getItineraryById(id: string) {
  return await Itinerary.findById(id)
    .populate("createdBy", "username email")
    .populate("accommodations")
    .populate("pointsOfInterest");
}

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

export async function deleteItineraryById(id: string) {
  return await Itinerary.findByIdAndDelete(id);
}

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
