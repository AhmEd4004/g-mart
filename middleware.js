// middleware.js
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { userAgent } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 0. skip Next.js internals & API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/adminLogin") ||
    pathname.startsWith("/unsupported")
  ) {
    return NextResponse.next();
  }

  // 1. adminPanel → only authentication
  if (pathname.startsWith("/adminPanel")) {
    const session = await auth();
    if (!session) {
      const signInUrl = new URL("/adminLogin", request.url);
      signInUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // 2. everything else (“the app”) → only mobile/tablet
  const { device } = userAgent(request);
  if (device.type === "desktop" || device.type === undefined) {
    return NextResponse.redirect(new URL("/unsupported", request.url));
  }

  // 3. allow mobile/tablet through
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};