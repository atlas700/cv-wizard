import { z } from "zod";

export const achievementSchema = z.object({
  title: z.string().min(1, { message: "Title is Required" }),
  description: z.string().optional(),
  date: z.string().optional(),
});
