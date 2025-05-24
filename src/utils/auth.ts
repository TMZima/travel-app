import { jwtVerify, JWTPayload } from "jose";
import { NextRequest } from "next/server";
import { BadRequestError, NotFoundError } from "@/utils/customErrors";

/**
 * Verifies the JWT token and returns the payload.
 * @param token - The JWT token string.
 * @param secret - The JWT secret.
 * @returns The decoded payload or null.
 */
export async function getUserFromToken(
  token: string,
  secret: string
): Promise<JWTPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extracts the user ID from the request's Authorization header.
 * @param req - The Next.js request object.
 * @param secret - The JWT secret.
 * @returns The user ID as a string.
 * @throws Error if the token is invalid or missing.
 */
export async function getUserIdFromRequest(
  req: NextRequest,
  secret: string
): Promise<string> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new BadRequestError("Authorization header missing");
  const token = authHeader.replace("Bearer ", "");
  const userPayload = await getUserFromToken(token, secret);
  if (!userPayload || (!userPayload.sub && !userPayload.id)) {
    throw new NotFoundError("User not found in token");
  }
  // Prefer sub, fallback to id
  return (userPayload.sub as string) || (userPayload.id as string);
}
