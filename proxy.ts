import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (isPublic) {
    // Already signed in: skip the login screen.
    if (session && pathname === "/login") {
      return NextResponse.redirect(new URL("/inbox", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    const next = `${pathname}${search}`;
    if (next !== "/" && next !== "/inbox") loginUrl.searchParams.set("next", next);
    const response = NextResponse.redirect(loginUrl);
    // Clear any stale or tampered cookie.
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Everything except Next internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml)$).*)",
  ],
};
