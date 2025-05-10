import { NextResponse } from "next/server";
import { AppError } from "./customErrors";

function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

export function handleApiError(err: unknown) {
  if (isAppError(err)) {
    return NextResponse.json(
      {
        error: err.message,
        message: err.userMessage,
        status: err.statusCode,
        code: err.constructor.name,
      },
      { status: err.statusCode }
    );
  }

  console.error("Unhandled error:", err);

  return NextResponse.json(
    {
      error: "Internal server error",
      message: "An unexpected error occurred. Please try again later.",
      status: 500,
      stackTrace: process.env.NODE_ENV === "development" ? err : undefined,
    },
    { status: 500 }
  );
}
