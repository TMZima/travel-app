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
import { getJwtSecret, getUserIdFromUrl } from "@/utils/helperService";
import { IUserDocument } from "@/models/userModel";
import { validateObjectId } from "@/utils/helperRepository";

// --- Interfaces ---
interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  user: {
    _id: string;
    username: string;
    email: string;
  };
  token: string;
}

interface UpdateUserResponse {
  user: IUserDocument;
}

/**
 * Register a new user
 * @param req - The Next.js request object
 * @returns An object containing the registered user's details and a JWT token
 * @throws MalformedRequestError if the request body is invalid
 * @throws BadRequestError if any required fields are missing
 * @throws ConflictError if the email is already in use
 * @throws ConfigurationError if the JWT secret is not set
 * @throws MongooseValidationError if there is a validation error
 */
export async function registerUserService(
  req: NextRequest
): Promise<RegisterUserResponse> {
  await dbConnect();

  let requestBody: RegisterRequestBody;
  try {
    requestBody = await req.json();
  } catch {
    throw new MalformedRequestError("Invalid JSON in request body");
  }

  const { username, email, password } = requestBody;

  if (!username || !email || !password) {
    throw new BadRequestError("All fields are required");
  }

  const userExists = await findUserByEmail(email);
  if (userExists) {
    throw new ConflictError("Email already in use");
  }

  const secret = getJwtSecret();

  try {
    const newUser = await createUser({ username, email, password });

    const token = jwt.sign({ id: newUser._id }, secret, {
      expiresIn: "7d",
    });

    return {
      user: {
        _id: newUser._id.toString(),
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

/**
 * Fetch a user by ID
 * @param req - The Next.js request object
 * @returns The user object
 * @throws NotFoundError if the user is not found
 */
export async function getUserService(req: NextRequest): Promise<IUserDocument> {
  await dbConnect();

  const userId = getUserIdFromUrl(req);
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}

/**
 * Update a user by ID
 * @param req - The Next.js request object
 * @returns An object containing the updated user details
 * @throws NotFoundError if the user is not found
 */
export async function updateUserService(
  req: NextRequest
): Promise<UpdateUserResponse> {
  await dbConnect();

  const userId = getUserIdFromUrl(req);
  const requestBody = await req.json();

  const updatedUser = await updateUserById(userId, requestBody);
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return { user: updatedUser };
}

/**
 * Delete a user by ID
 * @param req - The Next.js request object
 * @returns A message indicating that the user was deleted successfully
 * @throws NotFoundError if the user is not found
 */
export async function deleteUserService(
  req: NextRequest
): Promise<{ message: string }> {
  await dbConnect();

  const userId = getUserIdFromUrl(req);
  if (!userId) {
    throw new BadRequestError("User ID is required");
  }

  validateObjectId(userId, "Invalid user ID");

  const deletedUser = await deleteUserById(userId);
  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return { message: "User deleted successfully" };
}
