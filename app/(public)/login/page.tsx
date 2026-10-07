import Image from "next/image";
import LoginForm from "./login-form";

export default function Login() {
	return (
		<div className="min-h-screen flex">
			<div className="relative hidden sm:block w-1/2 min-h-screen">
				<Image src="/assets/images/article.jpg" alt="Login" fill priority className="object-cover" />
			</div>

			<div className="flex w-full sm:w-1/2 min-h-screen items-center justify-center px-6 sm:px-8">
				<LoginForm />
			</div>
		</div>
	);
}