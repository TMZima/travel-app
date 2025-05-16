import { NextResponse } from "next/server";
import { AppError } from "./customErrors";

function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

export function handleApiError(err: unknown) {
  if (isAppError(err)) {
    return {
      status: err.statusCode,
      body: {
        error: err.message,
        message: err.userMessage,
        status: err.statusCode,
        code: err.constructor.name,
      },
    };
  }

  console.error("Unhandled error:", err);

  return {
    status: 500,
    body: {
      error: "Internal server error",
      message: "An unexpected error occurred. Please try again later.",
      status: 500,
      stackTrace:
        process.env.NODE_ENV === "development" && err instanceof Error
          ? err.stack
          : undefined,
    },
  };
}
