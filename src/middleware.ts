import { NextRequest, NextResponse } from "next/server";

export const middleware = async function (req: NextRequest) {
  const cookie = req.cookies.get("auth_session");
  const pathname = req.nextUrl.pathname;

  if (!cookie && (pathname.includes("/task-management") || pathname.includes("/judge") || pathname.includes("/qr") || pathname.includes("/pdf-chat"))) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

}

export const config = {
  matcher: ["/services/:path*"],
};