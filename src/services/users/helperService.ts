import { NextRequest } from "next/server";
import { BadRequestError } from "@/utils/customErrors";

// --- Helper: userId parsing ---
export function getUserIdFromUrl(req: NextRequest): string {
  const urlParts = req.nextUrl.pathname.split("/");
  const userId = urlParts[urlParts.length - 1];
  if (!userId) throw new BadRequestError("User ID is required");
  return userId;
}
