import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "@/lib/http/api-error";

export async function handleRoute<T>(handler: () => Promise<T>) {
  try {
    const data = await handler();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: error.status }
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request",
          code: "INVALID_REQUEST",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
        details: message,
      },
      { status: 500 }
    );
  }
}
