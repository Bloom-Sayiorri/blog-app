import { z } from "zod";

export const TagSchema = z.object({
    name: z.string().trim().min(2).max(30),
})