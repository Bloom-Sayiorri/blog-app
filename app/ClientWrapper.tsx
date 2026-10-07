"use client";

import Footer from "@/ui/footer";
import Navbar from "@/ui/navbar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function ClientWrapperLayout({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    const hideLayout = ["/login", "/signup"].includes(pathname);

    return (
        <SessionProvider>
            {!hideLayout && <Navbar />}
			<main className="flex-1">{children}</main>
			{!hideLayout && <Footer />}
        </SessionProvider>
    );
}