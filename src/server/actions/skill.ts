"use server";

import { skillSchema } from "@/schema/skill";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createProfileSkill as createProfileSkillDb,
  deleteProfileSkill as deleteProfileSkillDb,
  updateProfileSkill as updateProfileSkillDb,
} from "../db/skill";

export async function createProfileSkill(
  profileId: string,
  unsafeData: z.infer<typeof skillSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = skillSchema.safeParse(unsafeData);

  if (!success || userId == null)
    return {
      error: true,
      message: "There was an error saving your profile Skills data",
    };

  const insertRows = data.skills.map((skill) => ({
    profileId,
    skillName: skill.skillName,
  }));

  const id = await createProfileSkillDb(insertRows);

  redirect(`/dashboard/profiles/${profileId}/edit?tab=skill`);
}

export async function updateProfileSkill(
  profileId: string,
  unsafeData: z.infer<typeof skillSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { success, data } = skillSchema.safeParse(unsafeData);

  const errorMessage = "There was an error updating your skill data";

  if (!success || userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const insertRow = data.skills.map((skill) => ({
    profileId,
    skillName: skill.skillName,
  }));

  const isSuccess = await updateProfileSkillDb(insertRow, {
    userId,
    profileId,
  });

  return {
    error: !isSuccess,
    message: isSuccess ? "Skills details updated" : errorMessage,
  };
}

export async function deleteProfileSkill({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const errorMessage = "There was an error deleting your skill";

  if (userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await deleteProfileSkillDb({ profileId, id });

  return {
    error: !isSuccess,
    message: isSuccess ? "Skill deleted successfully" : errorMessage,
  };
}
