import mongoose, { Schema, Document } from "mongoose";

export interface IPointOfInterest extends Document {
  name: string;
  location: string;
  description: string;
  belongsTo: mongoose.Types.ObjectId;
  createdAt: Date;
  editedAt: Date;
}

const pointOfInterestSchema = new Schema<IPointOfInterest>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "editedAt" } }
);

export const PointOfInterest =
  mongoose.models.PointOfInterest ||
  mongoose.model<IPointOfInterest>("PointOfInterest", pointOfInterestSchema);
