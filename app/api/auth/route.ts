import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "auth-token";
const AUTH_COOKIE_VALUE = "authenticated";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const accessPassword = process.env.ACCESS_PASSWORD;

    if (!accessPassword) {
      return NextResponse.json(
        { error: "Access password not configured" },
        { status: 500 }
      );
    }

    if (password === accessPassword) {
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
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
