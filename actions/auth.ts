"use server";

import { signIn } from "@/auth";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { LoginSchema } from "@/validators/auth";
import { AuthError } from "next-auth";
import { SignupSchema } from "@/validators/auth";

export type SignupState = {
	success: boolean;
	error?: string;
	errors?: {
		username?: string[];
		email?: string[];
		password?: string[];
		confirmPassword?: string[];
	};
	message?: string | null;
};
export async function signup(prevState: SignupState, formData: FormData) {
	const validatedFields = SignupSchema.safeParse({
		username: formData.get("username"),
		email: formData.get("email"),
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if(!validatedFields.success) {
		return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Invalid fields." };
	}
	const { username, email, password } = validatedFields.data;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});
		return {
			success: true,
			message: "User created successfully.",
		};
	} catch (error: unknown) {
		 if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
				const target =
					"meta" in error && error.meta && typeof error.meta === "object" && "target" in error.meta
						? (error.meta.target as string[])
						: [];

				return {
					success: false,
					error: `A user with that ${target.includes("email") ? "email" : "username"} already exists.`,
				};
			}
		console.error(error);
		return { success: false, message: "Failed to create user." };
	}
}

export type LoginState = {
	success: boolean;
	errors?: {
		email?: string[];
		password?: string[];
	},
	message?: string | null;
}
export async function login(prevState: LoginState | null, formData: FormData) {
	const validatedFields = LoginSchema.safeParse({
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Invalid fields.",
		};
	}
	const { email, password } = validatedFields.data;
	try {
		await signIn("credentials", {email, password, redirectTo: "/"});
		return{ success: true, message: "Successfully logged in."};
	} catch (error: unknown) {
		console.error(error);
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return {
						success: false,
						message: "Invalid credentials",
					};
				default:
					return {
						success: false,
						message: "Something went wrong.",
					};
			}
		}
		throw error;
	}
}