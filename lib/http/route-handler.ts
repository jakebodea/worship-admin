import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "@/lib/http/api-error";
import { logger } from "@/lib/logger";
import { PlanningCenterApiError } from "@/lib/planning-center/core-client";

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

    if (error instanceof PlanningCenterApiError) {
      const code =
        error.status === 429
          ? "PLANNING_CENTER_RATE_LIMITED"
          : "PLANNING_CENTER_API_ERROR";
      const message =
        error.status === 429
          ? "Planning Center rate limit exceeded. Please wait and try again."
          : "Planning Center request failed.";
      const retryAfterSeconds = error.retryAfterSeconds;
      const headers = retryAfterSeconds
        ? { "Retry-After": String(retryAfterSeconds) }
        : undefined;

      log.warn(
        {
          err: error,
          status: error.status,
          code,
          rateLimit: error.rateLimit,
        },
        "Planning Center route error"
      );

      return NextResponse.json(
        {
          error: message,
          code,
          details: error.details,
          retryAfterSeconds,
          rateLimit: error.rateLimit,
        },
        { status: error.status, headers }
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
