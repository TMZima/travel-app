import {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserById,
  deleteUserById,
  saveResetToken,
  updateUserPassword,
} from "../userRepository";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

// Mock dependencies
jest.mock("@/models/userModel");
jest.mock("bcryptjs");

describe("userRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      const mockUser = { email: "test@test.com" };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await findUserByEmail("test@test.com");

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(result).toEqual(mockUser);
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockUser = { username: "testuser", email: "test@test.com" };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await createUser({
        username: "testuser",
        email: "test@test.com",
        password: "password123",
      });

      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@test.com",
        password: "password123",
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("findUserById", () => {
    it("should find a user by ID and exclude the password field", async () => {
      const mockUser = { _id: "123", username: "testuser" };
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await findUserById("123");

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockUser);
    });
  });

  describe("updateUserById", () => {
    it("should update a user by ID and return the updated user", async () => {
      const mockUser = { _id: "123", username: "updateduser" };
      (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await updateUserById("123", { username: "updateduser" });

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { username: "updateduser" },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("deleteUserById", () => {
    it("should delete a user by ID", async () => {
      const mockUser = { _id: "123", username: "testuser" };
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

      const result = await deleteUserById("123");

      expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockUser);
    });
  });

  describe("saveResetToken", () => {
    it("should save a reset token for a user", async () => {
      const mockUser = {
        _id: "123",
        save: jest.fn().mockResolvedValue(undefined),
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await saveResetToken("123", "mocked-token", 1234567890);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(mockUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });
      expect(mockUser.resetToken).toBe("mocked-token");
      expect(mockUser.resetTokenExpires).toBe(1234567890);
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if the user is not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        saveResetToken("123", "mocked-token", 1234567890)
      ).rejects.toThrow("User not found");
    });
  });

  describe("updateUserPassword", () => {
    it("should update the user's password if the token is valid", async () => {
      const mockUser = {
        _id: "123",
        resetToken: "mocked-token",
        resetTokenExpires: Date.now() + 10000,
        save: jest.fn().mockResolvedValue(undefined),
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

      const result = await updateUserPassword(
        "123",
        "newpassword123",
        "mocked-token"
      );

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
      expect(mockUser.password).toBe("hashedpassword");
      expect(mockUser.resetToken).toBeUndefined();
      expect(mockUser.resetTokenExpires).toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should return null if the token is invalid or expired", async () => {
      const mockUser = {
        _id: "123",
        resetToken: "mocked-token",
        resetTokenExpires: Date.now() - 10000, // Expired token
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await updateUserPassword(
        "123",
        "newpassword123",
        "mocked-token"
      );

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(result).toBeNull();
    });

    it("should return null if the user is not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const result = await updateUserPassword(
        "123",
        "newpassword123",
        "mocked-token"
      );

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(result).toBeNull();
    });
  });
});
