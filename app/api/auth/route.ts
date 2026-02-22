import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { ApiError } from "@/lib/http/api-error";
import { handleRoute } from "@/lib/http/route-handler";
import { logger } from "@/lib/logger";

const AUTH_COOKIE_NAME = "auth-token";
const AUTH_COOKIE_VALUE = "authenticated";
const bodySchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const log = logger.withRequest(request);
  return handleRoute(async () => {
    log.info("Auth request received");
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      log.warn({ issues: parsed.error.issues }, "Invalid auth request body");
      throw new ApiError(400, "INVALID_REQUEST", "Invalid request", parsed.error.issues);
    }
    const { password } = parsed.data;

    const accessPassword = process.env.ACCESS_PASSWORD;

    if (!accessPassword) {
      log.error("Access password not configured");
      throw new Error("Access password not configured");
    }

    if (password === accessPassword) {
      log.info("Auth successful");

      const response = NextResponse.json({ success: true });
      
      // Set auth cookie (expires in 30 days)
      response.cookies.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      return response;
    }

    log.warn("Invalid password attempt");
    throw new ApiError(401, "UNAUTHORIZED", "Invalid password");
  });
}
