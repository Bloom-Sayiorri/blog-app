import { z } from "zod";

export const CreatePostSchema = z.object({
	title: z.string().min(5, "Title must be at least 5 characters.").max(150, "Title cannot exceed 150 characters."),
	content: z.string().trim().min(30, "Content must be at least 30 characters."),
	excerpt: z.string().max(300, "Excerpt cannot exceed 300 characters.").optional().nullable(),
	categoryId: z.string().optional().nullable(),
});

export const UpdatePostSchema = CreatePostSchema.omit({
	categoryId: true,
}).extend({
	published: z.boolean().optional(),
});