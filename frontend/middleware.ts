import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from "./lib/constants/routes-name";
import { REFRESH_TOKEN_COOKIE_NAME } from "./lib/constants/cookies-name";

export function middleware(request: NextRequest) {
    const token = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith(LOGIN_ROUTE) || request.nextUrl.pathname.startsWith(REGISTER_ROUTE);
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"]
};