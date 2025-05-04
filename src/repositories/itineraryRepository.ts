import mongoose from "mongoose";
import Itinerary, {
  ItineraryData,
  ItineraryUpdateData,
} from "@/models/itineraryModel";
import { InternalServerError } from "@/utils/customErrors";

export async function createItinerary(data: ItineraryData) {
  try {
    return await Itinerary.create(data);
  } catch (err: any) {
    console.error("Error creating itinerary:", err);
    throw new InternalServerError(
      "Failed to create itinerary",
      "An error occurred while creating the itinerary. Please try again later."
    );
  }
}

export async function getItineraryById(id: string) {
  try {
    return await Itinerary.findById(id)
      .populate("createdBy", "username email")
      .populate("accommodations")
      .populate("pointsOfInterest");
  } catch (err: any) {
    console.error(`Error fetching itinerary by ID ${id}:`, err);
    throw new InternalServerError(
      "Failed to fetch itinerary",
      "An error occurred while fetching the itinerary. Please try again later."
    );
  }
}

export async function updateItineraryById(
  id: string,
  data: ItineraryUpdateData
) {
  try {
    return await Itinerary.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "username email")
      .populate("accommodations")
      .populate("pointsOfInterest");
  } catch (err: any) {
    console.error(`Error updating itinerary by ID ${id}:`, err);
    throw new InternalServerError(
      "Failed to update itinerary",
      "An error occurred while updating the itinerary. Please try again later."
    );
  }
}

export async function deleteItineraryById(id: string) {
  try {
    return await Itinerary.findByIdAndDelete(id);
  } catch (err: any) {
    console.error(`Error deleting itinerary by ID ${id}:`, err);
    throw new InternalServerError(
      "Failed to delete itinerary",
      "An error occurred while deleting the itinerary. Please try again later."
    );
  }
}

export async function getAllItinerariesByUser(
  userId: string | mongoose.Types.ObjectId,
  skip = 0,
  limit = 10
) {
  try {
    return await Itinerary.find({ createdBy: userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .populate("accommodations")
      .populate("pointsOfInterest");
  } catch (err: any) {
    console.error(`Error fetching itineraries for user ${userId}:`, err);
    throw new InternalServerError(
      "Failed to fetch itineraries",
      "An error occurred while fetching itineraries. Please try again later."
    );
  }
}
