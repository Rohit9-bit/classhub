import { NextResponse } from "next/server";

// Success response
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

// Error response
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

// Validation error response (optional)
export function validationError(errors: Record<string, string>, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      errors,
    },
    { status }
  );
}
