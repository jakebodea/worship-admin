import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "auth-token";
const AUTH_COOKIE_VALUE = "authenticated";

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Allow access to auth API route
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (authCookie?.value === AUTH_COOKIE_VALUE) {
    return NextResponse.next();
  }

  // Redirect to password page if not authenticated
  if (request.nextUrl.pathname !== "/auth") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
