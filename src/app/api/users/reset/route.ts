import { NextRequest } from "next/server";
import { resetPassword } from "@/controllers/userController";

export async function POST(req: NextRequest) {
  return await resetPassword(req);
}
