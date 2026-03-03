import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/predict", "/history", "/profile", "/admin"];
const authPaths = ["/login", "/signup"];

function decodeJWTPayload(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin route protection
  if (pathname.startsWith("/admin") && accessToken) {
    const payload = decodeJWTPayload(accessToken);
    if (payload?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/predict/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
