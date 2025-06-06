import { NextResponse } from "next/server";
import { handleApiError } from "./apiErrorHandler";

// Success response
export function sendSuccess<T>(
  data: T,
  status: number = 200,
  message: string = "Operation successful"
) {
  return NextResponse.json(
    {
      status,
      message,
      data,
    },
    { status }
  );
}

// Error response
export function sendError(err: unknown) {
  const { status, body } = handleApiError(err);

  if (status === 500) {
    console.error("Internal server error:", body);
  }

  return NextResponse.json(body, { status });
}
