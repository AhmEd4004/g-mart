// middleware.js
import { auth } from "@/app/api/auth/[...nextauth]/route";;
import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = await auth();
  
  // 2. Redirect unauthenticated users
  if (!session) {
    const signInUrl = new URL("/adminLogin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
}

// 3. Specify protected routes
export const config = {
  matcher: ["/adminPanel/:path*"]
};