import { NextRequest } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import User from "@/models/userModel";

import { dbConnect } from "@/config/db";
import { sendError, sendSuccess } from "@/utils/apiResponse";
import {
  BadRequestError,
  ConfigurationError,
  ConflictError,
  MalformedRequestError,
} from "@/utils/customErrors";
import { MongooseValidationError } from "@/utils/customErrors";

export async function registerUser(req: NextRequest) {
  try {
    // Ensure database connection
    try {
      await dbConnect();
    } catch (err) {
      throw new ConfigurationError(
        "Failed to connect to the database",
        "An internal server error occurred. Please try again later."
      );
    }

    // Parse JSON request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      throw new MalformedRequestError();
    }

    const { username, email, password } = requestBody;

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
      throw new ConfigurationError(
        "JWT secret is not set in environment variables",
        "Internal server error"
      );

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
    if (err instanceof mongoose.Error.ValidationError) {
      return sendError(new MongooseValidationError(err));
    }
    return sendError(err as Error);
  }
}
