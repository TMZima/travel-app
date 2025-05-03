import {
  registerUserService,
  getUserService,
  updateUserService,
  deleteUserService,
} from "../userService";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  deleteUserById,
} from "@/repositories/userRepository";
import mongoose from "mongoose";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  MongooseValidationError,
} from "@/utils/customErrors";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "mocked-secret";

// Mock dependencies
jest.mock("@/repositories/userRepository");
jest.mock("@/config/db");
jest.mock("jsonwebtoken");

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUserService", () => {
    it("should throw BadRequestError if any required fields are missing", async () => {
      const req = {
        json: jest.fn().mockResolvedValue({ email: "test@test.com" }),
      } as any;

      await expect(registerUserService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw ConflictError if email is already in use", async () => {
      delete process.env.JWT_SECRET;

      (findUserByEmail as jest.Mock).mockResolvedValue({
        email: "test@test.com",
      });

      const req = {
        json: jest.fn().mockResolvedValue({
          username: "test",
          email: "test@test.com",
          password: "Test@1234",
        }),
      } as any;

      await expect(registerUserService(req)).rejects.toThrow(ConflictError);

      process.env.JWT_SECRET = "mocked-secret";
    });

    it("should create a new user and return a token", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue(null);
      (createUser as jest.Mock).mockResolvedValue({
        _id: "123",
        username: "test",
        email: "test@test.com",
      });
      (jwt.sign as jest.Mock).mockReturnValue("mocked-token");

      const req = {
        json: jest.fn().mockResolvedValue({
          username: "test",
          email: "test@test.com",
          password: "Test@1234",
        }),
      } as any;

      const result = await registerUserService(req);

      expect(result).toEqual({
        user: {
          _id: "123",
          username: "test",
          email: "test@test.com",
        },
        token: "mocked-token",
      });
      expect(createUser).toHaveBeenCalledWith({
        username: "test",
        email: "test@test.com",
        password: "Test@1234",
      });
    });

    it("should throw MongooseValidationError if mongoose validation fails", async () => {
      const validationError = new mongoose.Error.ValidationError();
      validationError.message = "Validation failed";

      (createUser as jest.Mock).mockRejectedValue(validationError);

      const req = {
        json: jest.fn().mockResolvedValue({
          username: "test",
          email: "test@test.com",
          password: "test@1234",
        }),
      } as any;

      await expect(registerUserService(req)).rejects.toThrow(
        MongooseValidationError
      );
    });
  });

  describe("getUserService", () => {
    it("should throw NotFoundError if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
      } as any;

      await expect(getUserService(req)).rejects.toThrow(NotFoundError);
    });

    it("should return the user if found", async () => {
      (findUserById as jest.Mock).mockResolvedValue({
        _id: "123",
        username: "test",
        email: "test@test.com",
      });

      const req = {
        nextUrl: { pathname: "/api/users/123" }, // Mock the nextUrl property
      } as any;

      const result = await getUserService(req);

      expect(result).toEqual({
        _id: "123",
        username: "test",
        email: "test@test.com",
      });
    });
  });

  describe("updateUserService", () => {
    it("should throw NotFoundError if user does not exist", async () => {
      (updateUserById as jest.Mock).mockResolvedValue(null);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({ username: "updated" }),
      } as any;

      await expect(updateUserService(req)).rejects.toThrow(NotFoundError);
    });

    it("should update and return the user", async () => {
      (updateUserById as jest.Mock).mockResolvedValue({
        _id: "123",
        username: "updated",
        email: "test@test.com",
      });

      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({ username: "updated" }),
      } as any;

      const result = await updateUserService(req);

      expect(result).toEqual({
        user: {
          _id: "123",
          username: "updated",
          email: "test@test.com",
        },
      });
    });
  });

  describe("deleteUserService", () => {
    it("should throw NotFoundError if user does not exist", async () => {
      (deleteUserById as jest.Mock).mockResolvedValue(null);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
      } as any;

      await expect(deleteUserService(req)).rejects.toThrow(NotFoundError);
    });

    it("should delete the user and return a success message", async () => {
      (deleteUserById as jest.Mock).mockResolvedValue({
        _id: "123",
        username: "test",
        email: "test@test.com",
      });

      const req = {
        nextUrl: { pathname: "/api/users/123" },
      } as any;

      const result = await deleteUserService(req);

      expect(result).toEqual({ message: "User deleted successfully" });
    });
  });
});
