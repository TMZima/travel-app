import { NextRequest } from "next/server";
import { BadRequestError, ConfigurationError } from "@/utils/customErrors";

/**
 * Extracts the user ID from the request URL.
 * @param req - The Next.js request object
 * @returns The user ID as a string
 * @throws BadRequestError if the user ID is missing or invalid
 */
export function getUserIdFromUrl(req: NextRequest): string {
  const urlParts = req.nextUrl.pathname.split("/");
  const userId = urlParts[urlParts.length - 1];

  if (!userId || userId === "users") {
    throw new BadRequestError(
      `Invalid URL: User ID is required in the path (${req.nextUrl.pathname})`
    );
  }

  return userId;
}

/**
 * Get the JWT secret from environment variables
 * @returns The JWT secret from environment variables
 * @throws ConfigurationError if the JWT secret is not set
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ConfigurationError(
      "JWT secret is not set in environment variables"
    );
  }
  return secret;
}
