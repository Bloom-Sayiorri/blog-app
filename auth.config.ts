import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	providers: [],
	callbacks: {
		authorized({ auth, request }) {
			const { pathname } = request.nextUrl;
			const user = auth?.user;

			// Dashboard requires authentication
			if (pathname.startsWith("/dashboard")) {
				return !!auth?.user;
			}

			// Admin requires authentication + ADMIN role
			if (pathname.startsWith("/admin")) {
				return auth?.user?.role === "ADMIN";
			}

			return true;
		},
	},
} satisfies NextAuthConfig;