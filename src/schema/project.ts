import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, { message: "Title must be greater than 0" }),
  description: z.string(),
  duration: z.string(),
  link: z.string().url(),
});
