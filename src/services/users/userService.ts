import { NextRequest } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/config/db";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  deleteUserById,
} from "@/repositories/userRepository";
import {
  BadRequestError,
  ConfigurationError,
  ConflictError,
  MalformedRequestError,
  MongooseValidationError,
  NotFoundError,
} from "@/utils/customErrors";
import { getUserIdFromUrl } from "@/services/users/helperService";

// --- Interfaces ---
interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

// --- Register ---
export async function registerUserService(req: NextRequest) {
  await dbConnect();

  let requestBody: RegisterRequestBody;
  try {
    requestBody = await req.json();
  } catch {
    throw new MalformedRequestError();
  }

  const { username, email, password } = requestBody;

  if (!username || !email || !password) {
    throw new BadRequestError("All fields are required");
  }

  const userExists = await findUserByEmail(email);
  if (userExists) {
    throw new ConflictError("Email already in use");
  }

  try {
    const newUser = await createUser({ username, email, password });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ConfigurationError(
        "JWT secret is not set in environment variables"
      );
    }

    const token = jwt.sign({ id: newUser._id }, secret, {
      expiresIn: "7d",
    });

    return {
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    };
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new MongooseValidationError(err);
    }
    throw err;
  }
}

// --- Get User ---
export async function getUserService(req: NextRequest) {
  await dbConnect();

  const userId = getUserIdFromUrl(req);
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}

// --- Update User ---
export async function updateUserService(req: NextRequest) {
  await dbConnect();

  const userId = getUserIdFromUrl(req);
  const requestBody = await req.json();

  const updatedUser = await updateUserById(userId, requestBody);
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return { user: updatedUser };
}

// --- Delete User ---
export async function deleteUserService(req: NextRequest) {
  await dbConnect();

  const userId = getUserIdFromUrl(req);

  const deletedUser = await deleteUserById(userId);
  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return { message: "User deleted successfully" };
}
