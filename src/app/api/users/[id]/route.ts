import { NextRequest } from "next/server";
import { getUser, updateUser, deleteUser } from "@/controllers/userController";

export async function GET(req: NextRequest) {
  return await getUser(req);
}

export async function PUT(req: NextRequest) {
  return await updateUser(req);
}

export async function DELETE(req: NextRequest) {
  return await deleteUser(req);
}
