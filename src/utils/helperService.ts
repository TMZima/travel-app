import { ConfigurationError } from "@/utils/customErrors";

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
