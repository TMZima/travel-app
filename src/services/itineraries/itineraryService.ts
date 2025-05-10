import mongoose from "mongoose";
import { ItineraryData, ItineraryUpdateData } from "@/models/itineraryModel";
import {
  createItinerary,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  getAllItinerariesByUser,
} from "@/repositories/itineraryRepository";
import { BadRequestError, NotFoundError } from "@/utils/customErrors";

export async function createItineraryService(data: ItineraryData) {
  if (!data.title || !data.startDate || !data.endDate || !data.createdBy) {
    throw new BadRequestError(
      "Missing required fields",
      "Please provide all required fields"
    );
  }

  return await createItinerary(data);
}

export async function getItineraryService(id: string) {
  const itinerary = await getItineraryById(id);
  if (!itinerary) {
    throw new NotFoundError(
      "Itinerary not found",
      "The requested itinerary could not be found"
    );
  }
  return itinerary;
}

export async function updateItineraryService(
  id: string,
  data: ItineraryUpdateData
) {
  const updatedItinerary = await updateItineraryById(id, data);
  if (!updatedItinerary) {
    throw new NotFoundError(
      "Itinerary not found",
      "The itinerary you are trying to update does not exist"
    );
  }
  return updatedItinerary;
}

export async function deleteItineraryService(id: string) {
  const deletedItinerary = await deleteItineraryById(id);
  if (!deletedItinerary) {
    throw new NotFoundError(
      "Itinerary not found",
      "The itinerary you are trying to delete does not exist"
    );
  }
  return { message: "Itinerary deleted successfully" };
}

export async function getAllItinerariesService(
  userId: string,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;
  const itineraries = await getAllItinerariesByUser(userId, skip, limit);
  if (!itineraries || itineraries.length === 0) {
    throw new NotFoundError(
      "No itineraries found",
      "No itineraries were found for the specified user"
    );
  }
  return itineraries;
}
