import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email: string) {
  return await User.findOne({ email });
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  return await User.create(data);
}

export async function findUserById(id: string) {
  return await User.findById(id).select("-password");
}

export async function updateUserById(id: string, data: any) {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");
}

export async function deleteUserById(id: string) {
  return await User.findByIdAndDelete(id);
}

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
