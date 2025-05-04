import mongoose from "mongoose";
import { ItineraryData, ItineraryUpdateData } from "@/models/itineraryModel";
import {
  createItinerary,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  getAllItinerariesByUser,
} from "@/repositories/itineraryRepository";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ValidationError,
} from "@/utils/customErrors";

export async function createItineraryService(data: ItineraryData) {
  if (!data.title || !data.startDate || !data.endDate || !data.createdBy) {
    throw new BadRequestError(
      "Missing required fields",
      "Please provide all required fields"
    );
  }

  try {
    return await createItinerary(data);
  } catch (err: any) {
    console.error("Error creating itinerary:", err);
    if (err.name === "ValidationError") {
      throw new ValidationError(err.message, "Invalid itinerary data");
    }
    throw new InternalServerError(
      "Failed to create itinerary",
      "An error occurred while creating the itinerary. Please try again later."
    );
  }
}

export async function getItineraryService(id: string) {
  try {
    const itinerary = await getItineraryById(id);
    if (!itinerary) {
      throw new NotFoundError(
        "Itinerary not found",
        "The requested itinerary could not be found"
      );
    }
    return itinerary;
  } catch (err) {
    console.error("Error fetching itinerary:", err);
    throw new InternalServerError(
      "Failed to fetch itinerary",
      "An error occurred while fetching the itinerary. Please try again later."
    );
  }
}

export async function updateItineraryService(
  id: string,
  data: ItineraryUpdateData
) {
  try {
    const updatedItinerary = await updateItineraryById(id, data);
    if (!updatedItinerary) {
      throw new NotFoundError(
        "Itinerary not found",
        "The itinerary you are trying to update does not exist"
      );
    }
    return updatedItinerary;
  } catch (err: any) {
    console.error("Error updating itinerary:", err);
    if (err.name === "ValidationError") {
      throw new ValidationError(err.message, "Invalid itinerary data");
    }
    throw new InternalServerError(
      "Failed to update itinerary",
      "An error occurred while updating the itinerary. Please try again later."
    );
  }
}

export async function deleteItineraryService(id: string) {
  try {
    const deletedItinerary = await deleteItineraryById(id);
    if (!deletedItinerary) {
      throw new NotFoundError(
        "Itinerary not found",
        "The itinerary you are trying to delete does not exist"
      );
    }
    return { message: "Itinerary deleted successfully" };
  } catch (err) {
    console.error("Error deleting itinerary:", err);
    throw new InternalServerError(
      "Failed to delete itinerary",
      "An error occurred while deleting the itinerary. Please try again later."
    );
  }
}

export async function getAllItinerariesService(
  userId: string,
  page = 1,
  limit = 10
) {
  try {
    const skip = (page - 1) * limit;
    const itineraries = await getAllItinerariesByUser(userId, skip, limit);
    if (!itineraries || itineraries.length === 0) {
      throw new NotFoundError(
        "No itineraries found",
        "No itineraries were found for the specified user"
      );
    }
    return itineraries;
  } catch (err) {
    console.error("Error fetching itineraries:", err);
    throw new InternalServerError(
      "Failed to fetch itineraries",
      "An error occurred while fetching itineraries. Please try again later."
    );
  }
}
