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

	const handleGoogleLogin = async () => {
		await signIn("google", { callbackUrl });
	};

	const handleGithubLogin = async () => {
		await signIn("github", { callbackUrl });
	};

	return (
		<form action={formAction} className="w-full flex flex-col justify-center items-center bg-slate-200/70 rounded-lg">
			<h2 className="text-3xl">Login</h2>
			<p className="font-bold text-md md:text-lg text-gray-400">
				Don't have an account?{" "}
				<Link href="/register" className="text-blue-500 font-semibold">
					Sign Up
				</Link>
			</p>
			<div className="flex flex-col md:flex-col">
				{/* <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2">
					<GoogleIcon size={20} /> Login with Google
				</button>
				<button onClick={handleGithubLogin} className="flex items-center justify-center gap-2">
					<GithubIcon size={20} />
					Login with Github
				</button> */}
				<button
					type="button"
					onClick={() => signIn("google", { callbackUrl: "/boards" })}
					className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-gray-700 font-medium hover:bg-blue-600 hover:text-white transition duration-200 cursor-pointer">
					{/* <FcGoogle className="text-xl" /> */}
					<GoogleIcon size={20} />
					<span>Login in with Google</span>
				</button>

				<div className="flex items-center gap-3">
					<hr className="flex-1 border-gray-300" />
					<span className="text-gray-500 text-sm">OR</span>
					<hr className="flex-1 border-gray-300" />
				</div>
				<button
					type="button"
					onClick={() => signIn("google", { callbackUrl: "/boards" })}
					className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-gray-700 font-medium hover:bg-blue-600 hover:text-white transition duration-200 cursor-pointer">
					{/* <FcGoogle className="text-xl" /> */}
					<GithubIcon size={20} />
					<span>Login in with Github</span>
				</button>
			</div>
			<div className="flex flex-col gap-[-1]">
				<label className="mb-3 mt-5 block font-medium" htmlFor="email">
					Email
				</label>
				<div className="relative">
					<input
						className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 outline-2 placeholder:text-gray-500"
						id="email"
						type="email"
						name="email"
						placeholder="you@example.com"
					/>
					<HiOutlineAtSymbol className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
				</div>
			</div>
			<div className="flex flex-col gap-[-1]">
				<label className="mb-3 mt-5 block font-medium" htmlFor="password">
					Password
				</label>
				<div className="relative flex items-center justify-center">
					<input
						className="w-full rounded-md border border-gray-100 py-2.25 pl-10 outline-2 placeholder:text-gray-500"
						id="password"
						type="password"
						name="password"
						placeholder="password"
						minLength={6}
					/>
					<BsKey className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
				</div>
			</div>
			<input type="hidden" name="redirectTo" value={callbackUrl} />
			<Button aria-disabled={isPending} type="submit" variant="success" className="">
				{isPending ? "Submitting..." : "Login"}
			</Button>
			<div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
				{state.errors?.email?.map((err) => (
					<>
						<BsExclamationCircleFill className="h-5 w-5 text-red-500" />
						<p className="text-sm text-red-500">{err.toString()}</p>
					</>
				))}
			</div>
		</form>
	);
}