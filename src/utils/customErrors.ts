import mongoose from "mongoose";

export class AppError extends Error {
  statusCode: number;
  userMessage: string;

  constructor(message: string, statusCode: number, userMessage: string) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class MongooseValidationError extends AppError {
  constructor(err: mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    super("Validation failed", 400, messages);
  }
}

export class ConfigurationError extends AppError {
  constructor(
    message = "Configuration error",
    userMessage = "An internal server error occurred. Please try again later."
  ) {
    super(message, 500, userMessage);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = "Resource not found",
    userMessage = "The requested resource could not be found"
  ) {
    super(message, 404, userMessage);
  }
}

export class ConflictError extends AppError {
  constructor(
    message = "Conflict occurred",
    userMessage = "This email is already registered"
  ) {
    super(message, 409, userMessage);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = "Unauthorized access",
    userMessage = "Invalid email or password"
  ) {
    super(message, 401, userMessage);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", userMessage = "Invalid request data") {
    super(message, 400, userMessage);
  }
}
