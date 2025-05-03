import mongoose, { Schema, Document } from "mongoose";

export interface IAccommodation extends Document {
  type: string;
  name: string;
  address: string;
  confirmationNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  location: string;
  belongsTo: mongoose.Types.ObjectId;
  createdAt: Date;
  editedAt: Date;
}

const accommodationSchema = new Schema<IAccommodation>(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    confirmationNumber: { type: String },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    location: { type: String, required: true },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "editedAt" } }
);

export const Accommodation = mongoose.model<IAccommodation>(
  "Accommodation",
  accommodationSchema
);
