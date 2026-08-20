import { z } from "zod";

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export const SignupSchema = z
	.object({
		username: z.string().trim().min(3).max(30),
		email: z.email(),
		password: z.string().min(8),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match.",
	});