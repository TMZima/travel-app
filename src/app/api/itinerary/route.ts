import { NextRequest } from "next/server";
import { createItinerary } from "@/controllers/itineraryController";

export async function POST(req: NextRequest) {
  return await createItinerary(req);
}
