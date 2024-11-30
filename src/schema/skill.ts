import { z } from "zod";

export const skillSchema = z.object({
  skills: z
    .array(
      z.object({
        skillName: z
          .string()
          .min(1, "Skill name is required")
          .max(30, "Skill name must be 30 characters or less"),
      })
    )
    .min(1, "At least one skill is required"),
});
