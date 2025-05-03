import { getUserIdFromUrl } from "../helperService";
import { BadRequestError } from "@/utils/customErrors";

describe("getUserIdFromUrl", () => {
  it("should return the user ID from a valid URL", () => {
    const req = {
      nextUrl: { pathname: "/api/users/123" },
    } as any;

    const userId = getUserIdFromUrl(req);

    expect(userId).toBe("123");
  });

  it("should throw BadRequestError if the URL does not contain a user ID", () => {
    const req = {
      nextUrl: { pathname: "/api/users/" },
    } as any;

    expect(() => getUserIdFromUrl(req)).toThrow(BadRequestError);
    expect(() => getUserIdFromUrl(req)).toThrow("User ID is required");
  });

  it("should throw BadRequestError if the URL is malformed", () => {
    const req = {
      nextUrl: { pathname: "/api/users" }, // No trailing slash or user ID
    } as any;

    expect(() => getUserIdFromUrl(req)).toThrow(BadRequestError);
    expect(() => getUserIdFromUrl(req)).toThrow("User ID is required");
  });
});
