import { jwtVerify, JWTPayload } from "jose";

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
