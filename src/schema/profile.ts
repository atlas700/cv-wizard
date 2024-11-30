import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(20),
  email: z.string(),
  phoneNumber: z.string(),
  bio: z.string().optional(),
  location: z.string().optional(),
  portfolio: z.string().optional(),
  profession: z.string().min(1),
  profileImage: z.string().optional(),
});
