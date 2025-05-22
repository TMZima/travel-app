import mongoose, { Model } from "mongoose";
import "@/models/accommodationModel";
import "@/models/pointsOfInterestModel";

export interface IItinerary extends Document {
  _id: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  title: string;
  startDate: Date;
  endDate: Date;
  accommodations: mongoose.Types.ObjectId[];
  pointsOfInterest: mongoose.Types.ObjectId[];
  sharedWith: mongoose.Types.ObjectId[];
  uploadedEmails?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ItineraryInput = {
  createdBy: mongoose.Types.ObjectId;
  title: string;
  startDate: Date;
  endDate: Date;
  accommodations?: mongoose.Types.ObjectId[];
  pointsOfInterest?: mongoose.Types.ObjectId[];
  sharedWith?: mongoose.Types.ObjectId[];
  uploadedEmails?: string;
};

export type ItineraryUpdateData = Partial<ItineraryInput>;

const itinerarySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    accommodations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accommodation",
      },
    ],
    pointsOfInterest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PointOfInterest",
      },
    ],
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    uploadedEmails: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Itinerary: Model<IItinerary> =
  mongoose.models.Itinerary ||
  mongoose.model<IItinerary>("Itinerary", itinerarySchema);

export default Itinerary;
