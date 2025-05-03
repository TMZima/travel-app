import { handleApiError } from "../errorHandler";
import { AppError } from "../customErrors";

describe("handleApiError", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: originalEnv,
      writable: true,
    });
  });

  it("should return a structured error response for an AppError", () => {
    class NotFoundError extends AppError {
      constructor() {
        super(
          "Resource not found",
          404,
          "The requested resource was not found."
        );
      }
    }

    const error = new NotFoundError();

    const result = handleApiError(error);

    expect(result).toEqual({
      status: 404,
      body: {
        error: "Resource not found",
        message: "The requested resource was not found.",
        status: 404,
        code: "NotFoundError",
      },
    });
  });

  it("should return a 500 response for an unhandled error in development mode", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      writable: true,
    });

    const error = new Error("Unhandled error");

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = handleApiError(error);

    expect(consoleSpy).toHaveBeenCalledWith("Unhandled error:", error);
    expect(result).toEqual({
      status: 500,
      body: {
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again later.",
        status: 500,
        stackTrace: error,
      },
    });

    consoleSpy.mockRestore();
  });

  it("should return a 500 response for an unhandled error in production mode", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      writable: true,
    });

    const error = new Error("Unhandled error");

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = handleApiError(error);

    expect(consoleSpy).toHaveBeenCalledWith("Unhandled error:", error);
    expect(result).toEqual({
      status: 500,
      body: {
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again later.",
        status: 500,
        stackTrace: undefined,
      },
    });

    consoleSpy.mockRestore();
  });
});
