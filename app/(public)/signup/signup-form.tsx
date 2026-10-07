"use client";

import { signup, SignupState } from "@/actions/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useActionState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignupForm() {
	const initialState: SignupState = { errors: {}, message: null };
	const [state, formAction] = useActionState(signup, initialState);

	return (
		// <div className="">
		// 	<h2 className="">Signup</h2>
		// 	<div className="">
		// 		<button type="button" onClick={() => {}} className="">
		// 			Google
		// 		</button>
		// 		<button onClick={() => {}} className="">
		// 			Github
		// 		</button>
		// 	</div>
		// 	<form action={formAction} className="">
		// 		<div className="">
		// 			<label htmlFor="username">Username</label>
		// 			<input type="text" name="username" id="username" placeholder="Username..." className="" />
		// 		</div>
		// 		<div className="">
		// 			<label htmlFor="password"></label>
		// 			<input type="password" name="password" id="password" placeholder="Password..." className="" />
		// 		</div>
		// 	</form>
		// </div>
		<main className="flex min-h-screen items-center justify-center bg-linear-to-r from-blue-300 via-cyan-500 to-blue-400 px-4 sm:px-6">
			<section className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6">
				<h2 className="text-3xl sm:text-4xl font-bold text-blue-600">Login</h2>
				{/* Header */}
				{/* <div className="text-center">
					<h1 className="text-3xl sm:text-4xl font-bold text-blue-600">New To DevBoard ?</h1>
					<p className="text-slate-600 mt-2">Sign in to continue to DevBoard</p>
				</div> */}

				<button
					type="button"
					onClick={() => signIn("google", { callbackUrl: "/" })}
					className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-gray-700 font-medium hover:bg-blue-600 hover:text-white transition duration-200">
					<FcGoogle className="text-xl" />
					<span>Sign up with Google</span>
				</button>

				<div className="flex items-center gap-3">
					<hr className="flex-1 border-gray-300" />
					<span className="text-gray-500 text-sm">OR</span>
					<hr className="flex-1 border-gray-300" />
				</div>

				<form action={formAction} className="flex flex-col gap-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							id="name"
							name="name"
							placeholder=""
							className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							required
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="you@example.com"
							className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							required
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="password"
							className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							required
						/>
					</div>

					<button
						type="submit"
						className="mt-2 w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition">
						Submit
					</button>

					{state && <p className="text-red-500 text-sm text-center mt-2">Map errors</p>}
				</form>

				<p className="text-center text-gray-600 text-sm mt-2">
					Already have an account?{" "}
					<Link href="/login" className="text-blue-600 hover:underline">
						Login
					</Link>
				</p>
			</section>
		</main>
	);



}