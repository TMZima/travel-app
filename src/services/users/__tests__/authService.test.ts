import {
  loginUserService,
  resetPasswordService,
  updatePasswordService,
} from "../authService";
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
import jwt from "jsonwebtoken";
import { dbConnect } from "@/config/db";

// Mock dependencies
jest.mock("@/repositories/userRepository");
jest.mock("jsonwebtoken");
jest.mock("@/config/db", () => ({
  dbConnect: jest.fn().mockResolvedValue(undefined),
}));

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginUserService", () => {
    it("should throw BadRequestError if email or password is missing", async () => {
      const req = {
        json: jest.fn().mockResolvedValue({ email: "test@test.com" }),
      } as any;

      await expect(loginUserService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if user does not exist", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue(null);

      const req = {
        json: jest.fn().mockResolvedValue({
          email: "test@test.com",
          password: "Test@1234",
        }),
      } as any;

      await expect(loginUserService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw ConfigurationError if JWT_SECRET is not set", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({
        _id: "123",
        email: "test@test.com",
        password: "hashedpassword",
        comparePassword: jest.fn().mockResolvedValue(true),
      });

      delete process.env.JWT_SECRET;

      const req = {
        json: jest.fn().mockResolvedValue({
          email: "test@test.com",
          password: "Test@1234",
        }),
      } as any;

      await expect(loginUserService(req)).rejects.toThrow(ConfigurationError);

      process.env.JWT_SECRET = "mocked-secret"; // Restore JWT_SECRET
    });

    it("should return a token and user details if credentials are valid", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({
        _id: "123",
        email: "test@test.com",
        username: "testuser",
        password: "hashedpassword",
        comparePassword: jest.fn().mockResolvedValue(true),
      });
      (jwt.sign as jest.Mock).mockReturnValue("mocked-token");

      process.env.JWT_SECRET = "mocked-secret";

      const req = {
        json: jest.fn().mockResolvedValue({
          email: "test@test.com",
          password: "Test@1234",
        }),
      } as any;

      const result = await loginUserService(req);

      expect(result).toEqual({
        token: "mocked-token",
        user: {
          id: "123",
          email: "test@test.com",
          username: "testuser",
        },
      });
    });
  });

  describe("resetPasswordService", () => {
    it("should throw BadRequestError if email is missing", async () => {
      const req = {
        json: jest.fn().mockResolvedValue({}),
      } as any;

      await expect(resetPasswordService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue(null);

      const req = {
        json: jest.fn().mockResolvedValue({ email: "test@test.com" }),
      } as any;

      await expect(resetPasswordService(req)).rejects.toThrow(NotFoundError);
    });

    it("should throw ConfigurationError if JWT_SECRET is not set", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({
        _id: "123",
        email: "test@test.com",
      });

      delete process.env.JWT_SECRET;

      const req = {
        json: jest.fn().mockResolvedValue({ email: "test@test.com" }),
      } as any;

      await expect(resetPasswordService(req)).rejects.toThrow(
        ConfigurationError
      );

      process.env.JWT_SECRET = "mocked-secret"; // Restore JWT_SECRET
    });

    it("should save a reset token and return a success message", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({
        _id: "123",
        email: "test@test.com",
      });
      (jwt.sign as jest.Mock).mockReturnValue("mocked-reset-token");
      (saveResetToken as jest.Mock).mockResolvedValue(undefined);

      process.env.JWT_SECRET = "mocked-secret";

      const req = {
        json: jest.fn().mockResolvedValue({ email: "test@test.com" }),
      } as any;

      const result = await resetPasswordService(req);

      expect(result).toEqual({ message: "Password reset email sent" });
      expect(saveResetToken).toHaveBeenCalledWith(
        "123",
        "mocked-reset-token",
        expect.any(Number)
      );
    });
  });

  describe("updatePasswordService", () => {
    it("should throw BadRequestError if token or newPassword is missing", async () => {
      const req = {
        json: jest.fn().mockResolvedValue({}),
      } as any;

      await expect(updatePasswordService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw ConfigurationError if JWT_SECRET is not set", async () => {
      delete process.env.JWT_SECRET;

      const req = {
        json: jest.fn().mockResolvedValue({
          token: "mocked-token",
          newPassword: "NewPassword123",
        }),
      } as any;

      await expect(updatePasswordService(req)).rejects.toThrow(
        ConfigurationError
      );

      process.env.JWT_SECRET = "mocked-secret"; // Restore JWT_SECRET
    });

    it("should throw UnauthorizedError if token is invalid or expired", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const req = {
        json: jest.fn().mockResolvedValue({
          token: "invalid-token",
          newPassword: "NewPassword123",
        }),
      } as any;

      await expect(updatePasswordService(req)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should throw UnauthorizedError if token type is invalid", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: "123", type: "invalid" });

      const req = {
        json: jest.fn().mockResolvedValue({
          token: "mocked-token",
          newPassword: "NewPassword123",
        }),
      } as any;

      await expect(updatePasswordService(req)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should update the password and return a success message", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({
        id: "123",
        type: "password-reset",
      });
      (updateUserPassword as jest.Mock).mockResolvedValue(true);

      const req = {
        json: jest.fn().mockResolvedValue({
          token: "mocked-token",
          newPassword: "NewPassword123",
        }),
      } as any;

      const result = await updatePasswordService(req);

      expect(result).toEqual({ message: "Password updated successfully" });
      expect(updateUserPassword).toHaveBeenCalledWith(
        "123",
        "NewPassword123",
        "mocked-token"
      );
    });
  });
});
