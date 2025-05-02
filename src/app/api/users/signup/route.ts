import { NextRequest } from "next/server";
import { registerUser } from "@/controllers/userController";
import { MethodNotAllowedError } from "@/utils/customErrors";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    throw new MethodNotAllowedError();
  }
  return await registerUser(req);
}
