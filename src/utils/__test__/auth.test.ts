import { TextEncoder } from "util";
global.TextEncoder = TextEncoder;

import { getUserFromToken, getUserIdFromRequest } from "../auth";
import { BadRequestError, NotFoundError } from "../customErrors";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

describe("auth utils", () => {
  const secret = "testsecret";
  const fakeToken = "faketoken";
  const fakePayload = { sub: "123", name: "Test User" };
  const encodedSecret = new TextEncoder().encode(secret);

  const mockJwtVerify = jwtVerify as jest.Mock;

  beforeEach(() => {
    mockJwtVerify.mockReset();
  });

  describe("getUserFromToken", () => {
    it("returns payload if token is valid", async () => {
      mockJwtVerify.mockResolvedValue({ payload: fakePayload });

      const result = await getUserFromToken(fakeToken, secret);

      expect(result).toEqual(fakePayload);
      expect(mockJwtVerify).toHaveBeenCalledWith(fakeToken, encodedSecret);
    });

    it("returns null if token is invalid", async () => {
      mockJwtVerify.mockRejectedValue(new Error("Invalid token"));

      const result = await getUserFromToken(fakeToken, secret);

      expect(result).toBeNull();
    });
  });

  describe("getUserIdFromRequest", () => {
    const makeReq = (authHeader?: string) =>
      ({
        headers: {
          get: (key: string) => (key === "authorization" ? authHeader : null),
        },
      } as unknown as NextRequest);

    it("throws BadRequestError if Authorization header is missing", async () => {
      await expect(
        getUserIdFromRequest(makeReq(undefined), secret)
      ).rejects.toThrow(BadRequestError);
    });

    it("throws NotFoundError if user not found in token", async () => {
      mockJwtVerify.mockResolvedValue({ payload: {} });

      await expect(
        getUserIdFromRequest(makeReq("Bearer token"), secret)
      ).rejects.toThrow(NotFoundError);
    });

    it("returns sub if present in payload", async () => {
      mockJwtVerify.mockResolvedValue({ payload: { sub: "abc123" } });

      const userId = await getUserIdFromRequest(
        makeReq("Bearer token"),
        secret
      );

      expect(userId).toBe("abc123");
    });

    it("returns id if sub is missing but id is present", async () => {
      mockJwtVerify.mockResolvedValue({ payload: { id: "xyz789" } });

      const req = {
        headers: {
          get: () => "Bearer faketoken",
        },
      } as unknown as NextRequest;

      const userId = await getUserIdFromRequest(req, secret);

      expect(userId).toBe("xyz789");
    });
  });
});
