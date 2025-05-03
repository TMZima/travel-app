import {
  AppError,
  MongooseValidationError,
  ConfigurationError,
  MalformedRequestError,
  NotFoundError,
  ValidationError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  TooManyRequestsError,
} from "../customErrors";
import mongoose from "mongoose";

describe("customErrors", () => {
  it("should create an AppError with the correct properties", () => {
    const error = new AppError(
      "Test error",
      400,
      "This is a user-friendly error message"
    );

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
    expect(error.userMessage).toBe("This is a user-friendly error message");
    expect(error.stack).toBeDefined();
  });

  it("should create a MongooseValidationError with the correct properties", () => {
    const mockValidationError = new mongoose.Error.ValidationError();
    mockValidationError.errors = {
      field1: { message: "Field1 is required" } as any,
      field2: { message: "Field2 must be a number" } as any,
    };

    const error = new MongooseValidationError(mockValidationError);

    expect(error).toBeInstanceOf(MongooseValidationError);
    expect(error.message).toBe("Validation failed");
    expect(error.statusCode).toBe(400);
    expect(error.userMessage).toBe(
      "Field1 is required, Field2 must be a number"
    );
  });

  it("should create a ConfigurationError with default properties", () => {
    const error = new ConfigurationError();

    expect(error).toBeInstanceOf(ConfigurationError);
    expect(error.message).toBe("Configuration error");
    expect(error.statusCode).toBe(500);
    expect(error.userMessage).toBe(
      "An internal server error occurred. Please try again later."
    );
  });

  it("should create a MalformedRequestError with default properties", () => {
    const error = new MalformedRequestError();

    expect(error).toBeInstanceOf(MalformedRequestError);
    expect(error.message).toBe("Malformed JSON request");
    expect(error.statusCode).toBe(400);
    expect(error.userMessage).toBe("The request body contains invalid JSON");
  });

  it("should create a NotFoundError with default properties", () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe("Resource not found");
    expect(error.statusCode).toBe(404);
    expect(error.userMessage).toBe("The requested resource could not be found");
  });

  it("should create a ValidationError with default properties", () => {
    const error = new ValidationError();

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe("Validation failed");
    expect(error.statusCode).toBe(400);
    expect(error.userMessage).toBe("Invalid input data");
  });

  it("should create a ConflictError with default properties", () => {
    const error = new ConflictError();

    expect(error).toBeInstanceOf(ConflictError);
    expect(error.message).toBe("Conflict occurred");
    expect(error.statusCode).toBe(409);
    expect(error.userMessage).toBe("This email is already registered");
  });

  it("should create an InternalServerError with default properties", () => {
    const error = new InternalServerError();

    expect(error).toBeInstanceOf(InternalServerError);
    expect(error.message).toBe("Internal server error");
    expect(error.statusCode).toBe(500);
    expect(error.userMessage).toBe("An unexpected error occurred");
  });

  it("should create an UnauthorizedError with default properties", () => {
    const error = new UnauthorizedError();

    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error.message).toBe("Unauthorized access");
    expect(error.statusCode).toBe(401);
    expect(error.userMessage).toBe(
      "You do not have permission to access this resource"
    );
  });

  it("should create a ForbiddenError with default properties", () => {
    const error = new ForbiddenError();

    expect(error).toBeInstanceOf(ForbiddenError);
    expect(error.message).toBe("Access forbidden");
    expect(error.statusCode).toBe(403);
    expect(error.userMessage).toBe(
      "You are not allowed to access this resource"
    );
  });

  it("should create a BadRequestError with default properties", () => {
    const error = new BadRequestError();

    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.message).toBe("Bad request");
    expect(error.statusCode).toBe(400);
    expect(error.userMessage).toBe("Invalid request data");
  });

  it("should create a TooManyRequestsError with default properties", () => {
    const error = new TooManyRequestsError();

    expect(error).toBeInstanceOf(TooManyRequestsError);
    expect(error.message).toBe("Too many requests");
    expect(error.statusCode).toBe(429);
    expect(error.userMessage).toBe(
      "You have exceeded the number of allowed requests"
    );
  });
});
