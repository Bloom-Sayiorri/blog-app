import { z } from "zod";

export const UpdateUserSchema = z.object({
	username: z.string().trim().min(3).max(30),
	email: z.email(),
	password: z.string().min(8).optional().or(z.literal("")),
	avatar: z
		.instanceof(File)
		.optional()
		.refine((file) => !file || file.size <= 4.5 * 1024 * 1024, "Avatar must be under 4.5MB"),
	bio: z.string().max(500).optional().nullable(),
});