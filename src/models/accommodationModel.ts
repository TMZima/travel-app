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
  createdBy: mongoose.Types.ObjectId;
  duration?: number; // Virtual field for duration of stay
}

const accommodationSchema = new Schema<IAccommodation>(
  {
    type: {
      type: String,
      required: true,
      enum: ["Hotel", "Airbnb", "Hostel", "Other"],
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    confirmationNumber: { type: String, default: "" },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    location: { type: String, required: true },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "editedAt" } }
);

// Virtual field - calculating the duration of the stay
accommodationSchema.virtual("duration").get(function (this: IAccommodation) {
  const checkIn = this.checkInDate ? new Date(this.checkInDate) : null;
  const checkOut = this.checkOutDate ? new Date(this.checkOutDate) : null;
  if (checkIn && checkOut) {
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
  return null;
});

const Accommodation = mongoose.model<IAccommodation>(
  "Accommodation",
  accommodationSchema
);

export default Accommodation;
