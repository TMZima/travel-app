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

export class MalformedRequestError extends AppError {
  constructor(
    message = "Malformed JSON request",
    userMessage = "The request body contains invalid JSON"
  ) {
    super(message, 400, userMessage);
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
export class ValidationError extends AppError {
  constructor(
    message = "Validation failed",
    userMessage = "Invalid input data"
  ) {
    super(message, 400, userMessage);
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

export class InternalServerError extends AppError {
  constructor(
    message = "Internal server error",
    userMessage = "An unexpected error occurred"
  ) {
    super(message, 500, userMessage);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = "Unauthorized access",
    userMessage = "You do not have permission to access this resource"
  ) {
    super(message, 401, userMessage);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = "Access forbidden",
    userMessage = "You are not allowed to access this resource"
  ) {
    super(message, 403, userMessage);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", userMessage = "Invalid request data") {
    super(message, 400, userMessage);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(
    message = "Too many requests",
    userMessage = "You have exceeded the number of allowed requests"
  ) {
    super(message, 429, userMessage);
  }
}
