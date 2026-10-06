import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { pathname } = req.nextUrl;
	const user = req.auth?.user;

	// Protect public routes
	if (
		pathname === "/" ||
		pathname.startsWith("/posts") ||
		pathname.startsWith("/about") ||
		pathname.startsWith("/contact") ||
		pathname.startsWith("/login") ||
		pathname.startsWith("/signup")
	) {
		return NextResponse.next();
	}

	// Protect dashboard routes
	if (pathname.startsWith("/dashboard") && !user) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Protect unauthenticated admin user
	if (pathname.startsWith("/admin") && !user) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Protect admin routes
	if (pathname.startsWith("/admin") && user?.role !== "ADMIN") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*"],
};