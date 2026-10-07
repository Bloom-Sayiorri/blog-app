"use client";

import { usePathname } from "next/navigation";

export default function About() {
    const pathname = usePathname();

    console.log(pathname);
    return (
        <div className="flex flex-col">
            Hello from about
        </div>
    );
}