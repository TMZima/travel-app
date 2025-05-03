import { NextRequest } from "next/server";
import { loginUser } from "@/controllers/userController";

export async function POST(req: NextRequest) {
  return await loginUser(req);
}
