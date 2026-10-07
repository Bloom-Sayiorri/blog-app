"use client";

import { useActionState } from "react";
import { login, LoginState } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GoogleIcon, GithubIcon } from "@dev.icons/react";
import { BsExclamationCircleFill, BsKey } from "react-icons/bs";
import { HiOutlineAtSymbol } from "react-icons/hi2";
import Button from "@/ui/components/button";

export default function LoginForm() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";
	const initialState: LoginState = { errors: {}, message: null };
	const [state, formAction, isPending] = useActionState(login, initialState);

	return (
		<main className="flex min-h-screen items-center justify-center px-4 sm:px-6 w-full">
			<section className="w-full backdrop-blur-md shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col gap-3">
				<h2 className="text-3xl sm:text-4xl font-bold text-blue-600 text-center">Login</h2>
				<button
					type="button"
					onClick={() => signIn("google", { callbackUrl: "/" })}
					className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-gray-700 font-medium hover:bg-blue-600 hover:text-white transition duration-200">
					<GoogleIcon className="text-xl" />
					<span>Sign up with Google</span>
				</button>
				<div className="flex items-center gap-3">
					<hr className="flex-1 border-gray-300" />
					<span className="text-gray-500 text-sm">OR</span>
					<hr className="flex-1 border-gray-300" />
				</div>
				<button
					type="button"
					onClick={() => signIn("github", { callbackUrl: "/" })}
					className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-gray-700 font-medium hover:bg-blue-600 hover:text-white transition duration-200">
					<GithubIcon className="text-xl" />
					<span>Sign up with Github</span>
				</button>
				<form action={formAction} className="flex flex-col gap-1">
					<div className="flex flex-col">
						<label className="mb-3 mt-5 block font-medium" htmlFor="email">
							Email
						</label>
						<div className="relative">
							<input
								className="w-full rounded-md border border-gray-300 py-2.25 pl-10 placeholder:text-gray-500"
								id="email"
								type="email"
								name="email"
								placeholder="you@example.com"
							/>
							<HiOutlineAtSymbol className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div className="flex flex-col">
						<label className="mb-3 mt-5 block font-medium" htmlFor="password">
							Password
						</label>
						<div className="relative flex items-center justify-center">
							<input
								className="w-full rounded-md border border-gray-300 py-2.25 pl-10 placeholder:text-gray-500"
								id="password"
								type="password"
								name="password"
								placeholder="password"
								minLength={6}
							/>
							<BsKey className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<Button aria-disabled={isPending} type="submit" variant="success" className="mt-4 w-full">
						{isPending ? "Submitting..." : "Login"}
					</Button>
				</form>
				<p className="text-center text-gray-600 text-sm flex justify-center">
					Already have an account?
					<Link href="/signup" className="text-blue-600 hover:underline">
						Signup
					</Link>
				</p>
				{state.errors?.email?.map((err) => (
					<div className="flex items-end space-x-1" aria-live="polite" aria-atomic="true">
						<>
							<BsExclamationCircleFill className="h-5 w-5 text-red-500" />
							<p className="text-sm text-red-500">{err.toString()}</p>
						</>
					</div>
				))}
			</section>
		</main>
	);
}