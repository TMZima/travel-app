import { NextRequest } from "next/server";
import {
  getFriends,
  addFriend,
  removeFriend,
} from "@/controllers/userController";

export async function GET(req: NextRequest) {
  return await getFriends(req);
}

export async function POST(req: NextRequest) {
  return await addFriend(req);
}

export async function DELETE(req: NextRequest) {
  return await removeFriend(req);
}
