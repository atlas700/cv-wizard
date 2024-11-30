import { z } from "zod";

export const educationSchema = z.object({
  location: z.string().optional(),
  institution: z.string(),
  degree: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
