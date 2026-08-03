import { z } from "zod";

export const CreatePostSchema = z.object({
	title: z.string().min(5).max(150),
	content: z.string().trim().min(30),
	excerpt: z.string().max(300).optional().nullable(),
	categoryId: z.string().optional().nullable(),
});

export const UpdatePostSchema = CreatePostSchema.extend({
    published: z.boolean().optional(),
})