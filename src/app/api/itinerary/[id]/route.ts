import { NextRequest } from "next/server";
import {
  getItinerary,
  updateItinerary,
  deleteItinerary,
} from "@/controllers/itineraryController";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return await getItinerary(req, context);
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return await updateItinerary(req, context);
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return await deleteItinerary(req, context);
}
