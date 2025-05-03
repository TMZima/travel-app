import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/config/db";
import {
  findUserByEmail,
  saveResetToken,
  updateUserPassword,
} from "@/repositories/userRepository";
import {
  BadRequestError,
  ConfigurationError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/customErrors";

// --- Interfaces ---.
interface LoginRequestBody {
  email: string;
  password: string;
}

interface ResetPasswordRequestBody {
  email: string;
}

interface UpdatePasswordRequestBody {
  token: string;
  newPassword: string;
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
