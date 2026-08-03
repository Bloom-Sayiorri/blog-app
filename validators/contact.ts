import { z } from "zod";

export const ContactSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.email(),
    subject: z.string().trim().min(5).max(100),
    message: z.string().trim().min(10).max(2000),
})