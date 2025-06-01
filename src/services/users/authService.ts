import jwt from "jsonwebtoken";
import { dbConnect } from "@/config/db";
import { findUserByEmail } from "@/repositories/userRepository";
import { BadRequestError, UnauthorizedError } from "@/utils/customErrors";
import { getJwtSecret } from "../../utils/helperService";

// --- Interfaces ---.
interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

/**
 * Login a user
 * @param req - The Next.js request object
 * @returns An object containing the user's token and basic user details
 * @throws BadRequestError if email or password is missing
 * @throws UnauthorizedError if the email or password is invalid
 * @throws ConfigurationError if JWT secret is not set
 */
export async function loginUserService(
  body: LoginRequestBody
): Promise<LoginResponse> {
  await dbConnect();

  const { email, password }: LoginRequestBody = body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await findUserByEmail(email);

  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const secret = getJwtSecret();
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    },
  };
}
