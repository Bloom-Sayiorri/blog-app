"use client";

import { usePathname } from "next/navigation";

export default function Home() {
	const pathname = usePathname();
	console.log(pathname);
	return (
		<div className="bg-red-400 h-full flex">
			<p>Hello World</p>
			<p>no way</p>
		</div>
	);
}