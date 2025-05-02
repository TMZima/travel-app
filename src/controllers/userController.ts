import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { dbConnect } from "@/config/db";
import { sendError, sendSuccess } from "@/utils/apiResponse";
import { BadRequestError, ConflictError } from "@/utils/customErrors";

export async function registerUser(req: NextRequest) {
  try {
    await dbConnect();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      throw new BadRequestError("All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ConflictError("Email already in use");
    }

    const newUser = await User.create({ username, email, password });

    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error("JWT secret is not set in environment variables");

    const token = jwt.sign({ id: newUser._id }, secret, {
      expiresIn: "7d",
    });

    return sendSuccess(
      {
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        token,
      },
      201
    );
  } catch (err) {
    return sendError(err as Error);
  }
}
