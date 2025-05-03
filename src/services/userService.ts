import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/config/db";
import {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserById,
  deleteUserById,
  saveResetToken,
  updateUserPassword,
} from "@/repositories/userRepository";
import {
  BadRequestError,
  ConfigurationError,
  ConflictError,
  MalformedRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/customErrors";

// --- Interfaces ---

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface FriendRequestBody {
  friendId: string;
}

interface ResetPasswordRequestBody {
  email: string;
}

interface UpdatePasswordRequestBody {
  token: string;
  newPassword: string;
}

// --- Helper: userId parsing ---
function getUserIdFromUrl(req: NextRequest): string {
  const urlParts = req.nextUrl.pathname.split("/");
  const userId = urlParts[urlParts.length - 1];
  if (!userId) throw new BadRequestError("User ID is required");
  return userId;
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
}

// --- Login ---
export async function loginUserService(req: NextRequest) {
  await dbConnect();

  const { email, password }: LoginRequestBody = await req.json();

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await findUserByEmail(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new BadRequestError("Invalid email or password");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ConfigurationError(
      "JWT secret is not set in environment variables"
    );
  }

  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });
  return {
    token,
    user: { id: user._id, email: user.email, username: user.username },
  };
}

// --- Request Password Reset ---
export async function resetPasswordService(req: NextRequest) {
  await dbConnect();

  const { email }: ResetPasswordRequestBody = await req.json();
  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Generate a password reset token (e.g., using JWT)
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ConfigurationError(
      "JWT secret is not set in environment variables"
    );
  }
  const resetToken = jwt.sign(
    { id: user._id, type: "password-reset" },
    secret,
    {
      expiresIn: "15m",
    }
  );

  // Save the reset token to the database or send it via email
  await saveResetToken(user._id, resetToken, Date.now() + 15 * 60 * 1000);

  return { message: "Password reset email sent" };
}

// --- Verify Reset Token & Update Password ---
export async function updatePasswordService(req: NextRequest) {
  await dbConnect();
  const { token, newPassword }: UpdatePasswordRequestBody = await req.json();

  if (!token || !newPassword) {
    throw new BadRequestError("Token and new password are required");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ConfigurationError("JWT secret is not set");

  let decoded;
  try {
    decoded = jwt.verify(token, secret) as { id: string; type: string };
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }

  if (decoded.type !== "password-reset") {
    throw new UnauthorizedError("Invalid token type");
  }

  const updatedUser = await updateUserPassword(decoded.id, newPassword, token);
  if (!updatedUser) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  return { message: "Password updated successfully" };
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

// --- Get Friends ---
export async function getFriendsService(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromUrl(req);

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  return { friends: user.friends };
}

// --- Add Friend ---
export async function addFriendService(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromUrl(req);
  const { friendId }: FriendRequestBody = await req.json();

  if (!friendId) throw new BadRequestError("Friend ID is required");

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  if (user.friends.includes(friendId)) {
    throw new ConflictError("Already friends");
  }

  user.friends.push(friendId);
  await user.save();

  return { message: "Friend added successfully" };
}

// --- Remove Friend ---
export async function removeFriendService(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromUrl(req);
  const { friendId }: FriendRequestBody = await req.json();

  if (!friendId) throw new BadRequestError("Friend ID is required");

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError("User not found");

  if (!user.friends.includes(friendId)) {
    throw new NotFoundError("Friend not found");
  }

  user.friends = user.friends.filter((id: string) => id !== friendId);
  await user.save();

  return { message: "Friend removed successfully" };
}
