import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

const AUTH_COOKIE_NAME = "auth-token";
const AUTH_COOKIE_VALUE = "authenticated";

export async function POST(request: NextRequest) {
  const log = logger.withRequest(request);
  log.info("Auth request received");

  try {
    const body = await request.json();
    const { password } = body;

    const accessPassword = process.env.ACCESS_PASSWORD;

    if (!accessPassword) {
      log.error("Access password not configured");
      return NextResponse.json(
        { error: "Access password not configured" },
        { status: 500 }
      );
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
    } else {
      log.warn("Invalid password attempt");
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.error({ err }, "Invalid auth request");
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
