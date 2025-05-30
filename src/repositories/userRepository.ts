import bcrypt from "bcryptjs";
import User, { IUserDocument } from "@/models/userModel";
import { validateObjectId } from "@/utils/helperRepository";
import { BadRequestError, NotFoundError } from "@/utils/customErrors";

/**
 * Find a user by email
 * @param email - The email of the user
 * @returns The user object or null if not found
 */
export async function findUserByEmail(
  email: string
): Promise<IUserDocument | null> {
  return await User.findOne({ email });
}

/**
 * Find a user by username
 * @param username - The username of the user
 * @returns The user object or null if not found
 */
export async function findUserByUsername(
  username: string
): Promise<IUserDocument | null> {
  return await User.findOne({ username });
}

/**
 * Create a new user
 * @param data - The user data (username, email, password)
 * @returns The created user object
 */
export async function createUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<IUserDocument> {
  return await User.create(data);
}

/**
 * Find a user by ID
 * @param id - The ID of the user
 * @returns The user object or null if not found
 * @throws BadRequestError if the ID is invalid
 */
export async function findUserById(id: string): Promise<IUserDocument | null> {
  validateObjectId(id, "Invalid user ID");
  return await User.findById(id).select("-password");
}

/**
 * Update a specific user
 * @param id - The ID of the user
 * @param data - The data to update
 * @returns The updated user object or null if not found
 * @throws BadRequestError if the ID is invalid
 */
export async function updateUserById(
  id: string,
  data: Partial<IUserDocument>
): Promise<IUserDocument | null> {
  validateObjectId(id, "Invalid user ID");
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");
}

/**
 * Delete a user by ID
 * @param id - The ID of the user
 * @returns The deleted user object or null if not found
 * @throws BadRequestError if the ID is invalid
 */
export async function deleteUserById(
  id: string
): Promise<IUserDocument | null> {
  validateObjectId(id, "Invalid user ID");
  return await User.findByIdAndDelete(id);
}

/**
 * Save a password reset token for a user
 * @param userId - The ID of the user
 * @param token - The reset token
 * @param expires - The expiration time of the token (in milliseconds)
 * @returns The updated user object
 * @throws NotFoundError if the user is not found
 */
export async function saveResetToken(
  userId: string,
  token: string,
  expires: number
): Promise<IUserDocument> {
  validateObjectId(userId, "Invalid user ID");
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  user.resetToken = token;
  user.resetTokenExpires = new Date(expires);
  await user.save({ validateBeforeSave: false });
  return user;
}

/**
 * Update a user's password using a reset token
 * @param userId - The ID of the user
 * @param newPassword - The new password to set
 * @param providedToken - The reset token provided by the user
 * @returns The updated user object
 * @throws BadRequestError if the token is invalid or expired
 */
export async function updateUserPassword(
  userId: string,
  newPassword: string,
  providedToken: string
): Promise<IUserDocument> {
  validateObjectId(userId, "Invalid user ID");
  const user = await User.findById(userId);
  if (
    !user ||
    user.resetToken !== providedToken ||
    !user.resetTokenExpires ||
    user.resetTokenExpires.getTime() < Date.now()
  ) {
    throw new BadRequestError("Invalid or expired reset token");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpires = null;

  await user.save();
  return user;
}
