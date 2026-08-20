import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
	const { pathname } = req.nextUrl;
	const user = req.auth?.user;

	// Protect dashboard routes
	if (pathname.startsWith("/dashboard") && !user) {
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