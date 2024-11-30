import { z } from "zod";

export const experienceSchema = z.object({
  location: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  jobTittle: z.string(),
  company: z.string(),
});
