import mongoose from "mongoose";
import { BadRequestError } from "@/utils/customErrors";

/**
 * Helper function to validate MongoDB ObjectIds
 * @param id - The ID to validate
 * @param errorMessage - The error message to throw if the ID is invalid
 */
export function validateObjectId(id: string, errorMessage: string): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError(errorMessage);
  }
}
