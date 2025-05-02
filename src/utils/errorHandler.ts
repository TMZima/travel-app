import { AppError } from "./customErrors";

export function handleApiError(err: unknown) {
  if (err instanceof AppError) {
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
      stackTrace: process.env.NODE_ENV === "development" ? err : undefined,
    },
  };
}
