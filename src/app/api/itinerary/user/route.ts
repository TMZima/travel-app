import { NextRequest } from "next/server";
import { getUserItineraries } from "@/controllers/itineraryController";

export async function GET(req: NextRequest) {
  return await getUserItineraries(req);
}
