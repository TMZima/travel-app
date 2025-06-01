import mongoose, { Schema, Document } from "mongoose";

interface Activity {
  time: string; // e.g. "09:00"
  description: string;
}

interface DayPlan {
  date: string; // e.g. "2024-07-01"
  activities: Activity[];
}

export interface IItinerary extends Document {
  createdBy: mongoose.Types.ObjectId;
  destination: string;
  startDate: Date;
  endDate: Date;
  days: DayPlan[];
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<Activity>(
  {
    time: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const dayPlanSchema = new Schema<DayPlan>(
  {
    date: { type: String, required: true },
    activities: { type: [activitySchema], default: [] },
  },
  { _id: false }
);

const itinerarySchema = new Schema<IItinerary>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: [dayPlanSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Itinerary ||
  mongoose.model<IItinerary>("Itinerary", itinerarySchema);
