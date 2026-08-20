"use client";

import { useActionState } from "react";
import { login, LoginState } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GoogleIcon } from "@dev.icons/react";
import { BsExclamationCircleFill } from "react-icons/bs";
import { HiOutlineAtSymbol } from "react-icons/hi2";
import { FaKey } from "react-icons/fa";

export default function LoginForm() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";
	const initialState: LoginState = { errors: {}, message: null }
	const [state, formAction, isPending] = useActionState(login, initialState);

	const handleGoogleLogin = async () => {
		await signIn("google", { callbackUrl });
	};

	const handleGithubLogin = async () => {
		await signIn("github", { callbackUrl });
	};

	return (
		<form action={formAction} className="">
			<h2 className="">Login to continue.</h2>
			<p className="font-bold text-lg text-gray-400">
				Don't have an account?{" "}
				<Link href="/register" className="text-blue-500 font-semibold">
					Sign Up
				</Link>
			</p>
			<button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2">
				<GoogleIcon size={20} /> Login with Google
			</button>
			<button onClick={handleGithubLogin}></button>
			<div>
				<label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
					Email
				</label>
				<div className="relative">
					<input
						className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
						id="email"
						type="email"
						name="email"
						placeholder="Enter your email address"
					/>
					<HiOutlineAtSymbol className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
				</div>
			</div>
			<div className="mt-4">
				<label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
					Password
				</label>
				<div className="relative">
					<input
						className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
						id="password"
						type="password"
						name="password"
						placeholder="Enter password"
						minLength={6}
					/>
					<FaKey className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
				</div>
			</div>
			<input type="hidden" name="redirectTo" value={callbackUrl} />
			{/* <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
				{state.errors?.email.map((err) => (
						<p>{err}</p>
					)) && (
					<>
						<BsExclamationCircleFill className="h-5 w-5 text-red-500" />
						<p className="text-sm text-red-500">{errorMessage}</p>
					</>
				)}
			</div> */}
			<button
				aria-disabled={isPending}
				type="submit"
				className="bg-green-500 text-white px-3 py-2 rounded-lg border-none hover:text-green-500 hover:bg-white">
				{isPending ? "Submitting..." : "Submit"}
			</button>
		</form>
	);
}