import { ObjectId } from "mongodb";
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
        _id: new ObjectId("60c72b2f9b1d8e001c8e4c3b"),
        friends: [new ObjectId("60c72b2f9b1d8e001c8e4c3c").toHexString()],
      });

      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
      } as any;

      const result = await getFriendsService(req);

      expect(result).toEqual({
        friends: ["60c72b2f9b1d8e001c8e4c3c"],
      });
      expect(findUserById).toHaveBeenCalledWith("60c72b2f9b1d8e001c8e4c3b");
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
      } as any;

      await expect(getFriendsService(req)).rejects.toThrow(NotFoundError);
    });
  });

  describe("addFriendService", () => {
    it("should add a friend and return a success message", async () => {
      const user = {
        _id: new ObjectId("60c72b2f9b1d8e001c8e4c3b"),
        friends: [],
        save: jest.fn().mockResolvedValue(undefined),
      };

      (findUserById as jest.Mock).mockResolvedValue(user);

      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
        json: jest.fn().mockResolvedValue({
          friendId: new ObjectId("60c72b2f9b1d8e001c8e4c3c").toHexString(),
        }),
      } as any;

      const result = await addFriendService(req);

      expect(result).toEqual({ message: "Friend added successfully" });
      expect(user.friends).toContainEqual(
        new ObjectId("60c72b2f9b1d8e001c8e4c3c")
      );
      expect(user.save).toHaveBeenCalled();
    });

    it("should throw BadRequestError if friendId is missing", async () => {
      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
        json: jest.fn().mockResolvedValue({}),
      } as any;

      await expect(addFriendService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
        json: jest.fn().mockResolvedValue({
          friendId: new ObjectId("60c72b2f9b1d8e001c8e4c3c").toHexString(),
        }),
      } as any;

      await expect(addFriendService(req)).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError if already friends", async () => {
      const user = {
        _id: new ObjectId("60c72b2f9b1d8e001c8e4c3b"),
        friends: [new ObjectId("60c72b2f9b1d8e001c8e4c3c")],
        save: jest.fn(),
      };

      (findUserById as jest.Mock).mockResolvedValue(user);

      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
        json: jest.fn().mockResolvedValue({
          friendId: new ObjectId("60c72b2f9b1d8e001c8e4c3c").toHexString(),
        }),
      } as any;

      await expect(addFriendService(req)).rejects.toThrow(ConflictError);
    });
  });

  describe("removeFriendService", () => {
    it("should remove a friend and return a success message", async () => {
      const user = {
        _id: new ObjectId("60c72b2f9b1d8e001c8e4c3b"),
        friends: [
          new ObjectId("60c72b2f9b1d8e001c8e4c3c"),
          new ObjectId("60c72b2f9b1d8e001c8e4c3d"),
        ],
        save: jest.fn().mockResolvedValue(undefined),
      };

      (findUserById as jest.Mock).mockResolvedValue(user);

      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
        json: jest.fn().mockResolvedValue({
          friendId: new ObjectId("60c72b2f9b1d8e001c8e4c3c").toHexString(),
        }),
      } as any;

      const result = await removeFriendService(req);

      expect(result).toEqual({ message: "Friend removed successfully" });
      expect(user.friends).not.toContainEqual(
        new ObjectId("60c72b2f9b1d8e001c8e4c3c")
      );
      expect(user.save).toHaveBeenCalled();
    });

    it("should throw BadRequestError if friendId is missing", async () => {
      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
        json: jest.fn().mockResolvedValue({}),
      } as any;

      await expect(removeFriendService(req)).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
        json: jest.fn().mockResolvedValue({
          friendId: new ObjectId("60c72b2f9b1d8e001c8e4c3c").toHexString(),
        }),
      } as any;

      await expect(removeFriendService(req)).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if friend is not in the user's friend list", async () => {
      const user = {
        _id: new ObjectId("60c72b2f9b1d8e001c8e4c3b"),
        friends: [new ObjectId("60c72b2f9b1d8e001c8e4c3d")],
        save: jest.fn(),
      };

      (findUserById as jest.Mock).mockResolvedValue(user);

      const req = {
        nextUrl: { pathname: "/api/users/60c72b2f9b1d8e001c8e4c3b" },
        json: jest.fn().mockResolvedValue({
          friendId: new ObjectId("60c72b2f9b1d8e001c8e4c3c").toHexString(),
        }),
      } as any;

      await expect(removeFriendService(req)).rejects.toThrow(NotFoundError);
    });
  });
});
