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
import { getJwtSecret } from "../../utils/helperService";

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

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

/**
 * Login a user
 * @param req - The Next.js request object
 * @returns An object containing the user's token and basic user details
 * @throws BadRequestError if email or password is missing
 * @throws UnauthorizedError if the email or password is invalid
 * @throws ConfigurationError if JWT secret is not set
 */
export async function loginUserService(
  req: NextRequest
): Promise<LoginResponse> {
  await dbConnect();

  const { email, password }: LoginRequestBody = await req.json();

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await findUserByEmail(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const secret = getJwtSecret();
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    },
  };
}

/**
 * Request a password reset
 * @param req - The Next.js request object
 * @returns A message indicating that the password reset email has been sent
 * @throws BadRequestError if email is missing
 * @throws NotFoundError if the user with the provided email does not exist
 * @throws ConfigurationError if JWT secret is not set
 */
export async function resetPasswordService(
  req: NextRequest
): Promise<{ message: string }> {
  await dbConnect();

  const { email }: ResetPasswordRequestBody = await req.json();
  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new NotFoundError("No user found with the provided email");
  }

  const secret = getJwtSecret();
  const resetToken = jwt.sign(
    { id: user._id, type: "password-reset" },
    secret,
    {
      expiresIn: "15m",
    }
  );

  await saveResetToken(
    user._id.toString(),
    resetToken,
    Date.now() + 15 * 60 * 1000
  );

  return { message: "Password reset email sent" };
}

/**
 * Verify reset token and update password
 * @param req - The Next.js request object
 * @returns A message indicating that the password has been updated
 * @throws BadRequestError if token or new password is missing
 * @throws UnauthorizedError if the token is invalid or expired
 * @throws ConfigurationError if JWT secret is not set
 */
export async function updatePasswordService(
  req: NextRequest
): Promise<{ message: string }> {
  await dbConnect();
  const { token, newPassword }: UpdatePasswordRequestBody = await req.json();

  if (!token || !newPassword) {
    throw new BadRequestError("Token and new password are required");
  }

  const secret = getJwtSecret();

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
