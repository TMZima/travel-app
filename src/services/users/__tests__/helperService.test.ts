import { getUserFromToken } from "../../../utils/auth";
import { BadRequestError } from "@/utils/customErrors";

describe("getUserFromToken", () => {
  it("should return the user ID from a valid token", () => {
    const req = {
      cookies: {
        get: (name: string) => {
          if (name === "token") {
            return { value: "valid-token" };
          }
          return null;
        },
      },
    } as any;

    const userId = getUserFromToken(req, "valid-token");

    expect(userId).toBe("123");
  });

  it("should throw BadRequestError if the URL does not contain a user ID", () => {
    const req = {
      nextUrl: { pathname: "/api/users/" },
    } as any;

    expect(() => getUserFromToken(req, "invalid-token")).toThrow(
      BadRequestError
    );
    expect(() => getUserFromToken(req, "invalid-token")).toThrow(
      "User ID is required"
    );
  });

  it("should throw BadRequestError if the URL is malformed", () => {
    const req = {
      nextUrl: { pathname: "/api/users" }, // No trailing slash or user ID
    } as any;

    expect(() => getUserFromToken(req, "invalid-token")).toThrow(
      BadRequestError
    );
    expect(() => getUserFromToken(req, "invalid-token")).toThrow(
      "User ID is required"
    );
  });
});
