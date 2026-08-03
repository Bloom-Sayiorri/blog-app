import { z } from "zod";

export const CreateUserSchema = z
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

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

export const UpdateUserSchema = z.object({
	username: z.string().trim().min(3).max(30),
	email: z.email(),
	password: z.string().min(8).optional().or(z.literal("")),
	avatar: z.string().url().optional().nullable(),
	bio: z.string().max(500).optional().nullable(),
});
