import User from "@/models/userModel";
import bcrypt from "bcryptjs";

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string) {
  return await User.findOne({ email });
}

/**
 * Create a new user
 */
export async function createUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  return await User.create(data);
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string) {
  return await User.findById(id).select("-password");
}

/**
 * Update a specific user
 */
export async function updateUserById(id: string, data: any) {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");
}

/**
 * Delete a user by ID
 */
export async function deleteUserById(id: string) {
  return await User.findByIdAndDelete(id);
}

/**
 * Save a password reset token for a user
 */
export async function saveResetToken(
  userId: string,
  token: string,
  expires: number
) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.resetToken = token;
  user.resetTokenExpires = new Date(expires);
  await user.save({ validateBeforeSave: false });
  return user;
}

/**
 * Update a user's password using a reset token
 */
export async function updateUserPassword(
  userId: string,
  newPassword: string,
  providedToken: string
) {
  const user = await User.findById(userId);
  if (
    !user ||
    user.resetToken !== providedToken ||
    !user.resetTokenExpires ||
    user.resetTokenExpires.getTime() < Date.now()
  ) {
    return null; // Invalid or expired token
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpires = null;

  await user.save();
  return user;
}
