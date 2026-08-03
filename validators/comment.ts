import { z } from "zod";

export const CommentSchema = z.object({
	content: z.string().trim().min(2).max(1000),
	postId: z.string(),
});