import User, { IUserDocument } from "@/models/userModel";
import { validateObjectId } from "@/utils/helperRepository";

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
