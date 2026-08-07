import { z } from "zod";

export const ContactSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name cannot exceed 100 characters."),
	email: z.email(),
	subject: z
		.string()
		.trim()
		.min(5, "Subject must be at least 5 characters.")
		.max(100, "Subject cannot exceed 100 characters."),
	message: z
		.string()
		.trim()
		.min(10, "Message must be at least 10 characters.")
		.max(2000, "Message cannot exceed 2000 characters."),
});