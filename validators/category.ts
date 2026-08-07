import { z } from "zod";

export const CategorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Category must be at least 2 characters.")
		.max(50, "Category cannot exceed 50 characters."),
});
