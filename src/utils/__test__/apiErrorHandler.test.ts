import { handleApiError } from "../apiErrorHandler";
import { AppError } from "../customErrors";

class CustomAppError extends AppError {
  constructor() {
    super("Custom error", 418, "I'm a teapot");
  }
}

describe("handleApiError", () => {
  it("returns correct structure for AppError", () => {
    const error = new CustomAppError();
    const result = handleApiError(error);

    expect(result).toEqual({
      status: 418,
      body: {
        message: "I'm a teapot",
        status: 418,
        code: "CustomAppError",
      },
    });
  });

  it("returns 500 and logs for unknown error", () => {
    const error = new Error("Unknown error");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = handleApiError(error);

    expect(consoleSpy).toHaveBeenCalledWith("Unhandled error:", error);
    expect(result.status).toBe(500);
    expect(result.body.message).toMatch(/unexpected error/i);

    consoleSpy.mockRestore();
  });

  it("includes stack trace in development mode", () => {
    const prev = process.env.NODE_ENV;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      configurable: true,
      writable: true,
    });
    const error = new Error("Dev error");

    const result = handleApiError(error);

    expect(consoleSpy).toHaveBeenCalledWith("Unhandled error:", error);
    expect(result.body.stackTrace).toBeDefined();
    Object.defineProperty(process.env, "NODE_ENV", {
      value: prev,
      configurable: true,
      writable: true,
    });
  });

  it("omits stack trace in production mode", () => {
    const prev = process.env.NODE_ENV;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      configurable: true,
      writable: true,
    });
    const error = new Error("Prod error");

    const result = handleApiError(error);

    expect(consoleSpy).toHaveBeenCalledWith("Unhandled error:", error);
    expect(result.body.stackTrace).toBeUndefined();
    Object.defineProperty(process.env, "NODE_ENV", {
      value: prev,
      configurable: true,
      writable: true,
    });
  });
});
