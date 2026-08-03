import { z } from "zod";

export const CategorySchema = z.object({
    name: z.string().trim().min(2).max(50),
})