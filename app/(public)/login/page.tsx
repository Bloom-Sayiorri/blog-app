import Image from "next/image";
import LoginForm from "./login-form";


export default function Login() {
	return (
		<div className="min-h-full flex justify-center">
            <Image src="/assets/images/article.jpg" alt="Login" width={1000} height={0} className="hidden sm:block w-1/2 h-full"/>
			<div className="flex flex-col justify-center items-center w-full max-w-md px-6 sm:px-8">
				<LoginForm />
			</div>
		</div>
	);
}