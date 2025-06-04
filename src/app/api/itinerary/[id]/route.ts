import { NextRequest, NextResponse } from "next/server";
import {
  getItinerary,
  updateItinerary,
  deleteItinerary,
} from "@/controllers/itineraryController";

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string> }
): Promise<NextResponse> {
  return getItinerary(req, { params });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Record<string, string> }
): Promise<NextResponse> {
  return updateItinerary(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Record<string, string> }
): Promise<NextResponse> {
  return deleteItinerary(req, { params });
}
