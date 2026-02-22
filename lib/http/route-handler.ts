import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "@/lib/http/api-error";
import { logger } from "@/lib/logger";

const log = logger.for("http/route-handler");

export async function handleRoute<T>(handler: () => Promise<T>) {
  try {
    const data = await handler();
    if (data instanceof Response) {
      return data;
    }
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      log.warn({ err: error, code: error.code, status: error.status }, "API route error");
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
      log.warn({ err: error }, "API route validation error");
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
    log.error({ err: error instanceof Error ? error : new Error(String(error)) }, "Unhandled route error");
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
