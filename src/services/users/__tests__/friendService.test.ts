import {
  getFriendsService,
  addFriendService,
  removeFriendService,
} from "../friendService";
import { findUserById } from "@/repositories/userRepository";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@/utils/customErrors";

jest.mock("@/repositories/userRepository");
jest.mock("@/config/db");

describe("friendService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFriendsService", () => {
    it("should return the user's friends", async () => {
      (findUserById as jest.Mock).mockResolvedValue({
        _id: "123",
        friends: ["456", "789"],
      });

      const req = { nextUrl: { pathname: "/api/users/123" } } as any;

      const result = await getFriendsService(req);

      expect(result).toEqual({ friends: ["456", "789"] });
      expect(findUserById).toHaveBeenCalledWith("123");
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      const req = { nextUrl: { pathname: "/api/users/123" } } as any;

      await expect(getFriendsService(req)).rejects.toThrow(NotFoundError);
    });
  });

  describe("addFriendService", () => {
    it("should add a friend and return a success message", async () => {
      const user = {
        _id: "123",
        friends: [],
        save: jest.fn().mockResolvedValue(undefined),
      };

      (findUserById as jest.Mock).mockResolvedValue(user);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({ friendId: "456" }),
      } as any;

      const result = await addFriendService(req);

      expect(result).toEqual({ message: "Friend added successfully" });
      expect(user.friends).toContain("456");
      expect(user.save).toHaveBeenCalled();
    });

    it("should throw BadRequestError if friendId is missing", async () => {
      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({}),
      } as any;

      await expect(addFriendService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({ friendId: "456" }),
      } as any;

      await expect(addFriendService(req)).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError if already friends", async () => {
      const user = {
        _id: "123",
        friends: ["456"],
        save: jest.fn(),
      };

      (findUserById as jest.Mock).mockResolvedValue(user);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({ friendId: "456" }),
      } as any;

      await expect(addFriendService(req)).rejects.toThrow(ConflictError);
    });
  });

  describe("removeFriendService", () => {
    it("should remove a friend and return a success message", async () => {
      const user = {
        _id: "123",
        friends: ["456", "789"],
        save: jest.fn().mockResolvedValue(undefined),
      };

      (findUserById as jest.Mock).mockResolvedValue(user);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({ friendId: "456" }),
      } as any;

      const result = await removeFriendService(req);

      expect(result).toEqual({ message: "Friend removed successfully" });
      expect(user.friends).not.toContain("456");
      expect(user.save).toHaveBeenCalled();
    });

    it("should throw BadRequestError if friendId is missing", async () => {
      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({}),
      } as any;

      await expect(removeFriendService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({ friendId: "456" }),
      } as any;

      await expect(removeFriendService(req)).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if friend is not in the user's friend list", async () => {
      const user = {
        _id: "123",
        friends: ["789"],
        save: jest.fn(),
      };

      (findUserById as jest.Mock).mockResolvedValue(user);

      const req = {
        nextUrl: { pathname: "/api/users/123" },
        json: jest.fn().mockResolvedValue({ friendId: "456" }),
      } as any;

      await expect(removeFriendService(req)).rejects.toThrow(NotFoundError);
    });
  });
});
