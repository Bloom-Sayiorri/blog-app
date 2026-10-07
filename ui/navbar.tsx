"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const router = useRouter();

	const links = [
		{ href: "/", label: "Home" },
		{ href: "/dashboard/posts", label: "Posts" },
		{ href: "/about", label: "About" },
		{ href: "/dashboard", label: "Dashboard" },
	];

	if(!status) {
		return <p>Not Logged in.</p>
	}

	return (
		<header className="flex w-full sticky top-0 px-2 py-3 ">
			{/* MOBILE */}
			{/* <div className="flex w-full"> */}
				{/* <Logo /> */}
				<nav className="hidden sm:flex">
					{links.map((link, index) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={index}
								href={link.href}
								className={`font-medium ${
									isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"
								}`}>
								{link.label}
							</Link>
						);
					})}
				</nav>
				{session?.user?.id ? (
					<button type="button" className="hidden md-flex" onClick={async () => await signOut({ redirectTo: "/" })}>
						Logout
					</button>
				) : (
					<Link href="/signup" className="hidden md:flex">
						Get Started
					</Link>
				)}
			{/* </div> */}
			{/* TABLET */}
			{/* <div className="">
				<Logo />
				<nav className="">
					<Link href="/">Home</Link>
					<Link href="/posts">Posts</Link>
					<Link href="/dashboard">Dashboard</Link>
					<Link href="/about">About</Link>
				</nav>
			</div> */}
			{/* DESKTOP */}
			{/* <div className="">
				<Logo />
				<nav className="">
					<Link href="/">Home</Link>
					<Link href="/posts">Posts</Link>
					<Link href="/dashboard">Dashboard</Link>
					<Link href="/about">About</Link>
				</nav>
			</div> */}
		</header>
	);
}