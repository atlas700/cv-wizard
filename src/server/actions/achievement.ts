"use server";

import { achievementSchema } from "@/schema/achievement";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createProfileAchievement as createProfileAchievementDb,
  deleteProfileAchievement as deleteProfileAchievementDb,
  updateProfileAchievement as updateProfileAchievementDb,
} from "../db/achievement";

export async function createProfileAchievement(
  profileId: string,
  unsafeData: z.infer<typeof achievementSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = achievementSchema.safeParse(unsafeData);

  if (!success || userId == null)
    return {
      error: true,
      message: "There was an error saving your profile Achievement data",
    };

  const id = await createProfileAchievementDb({ ...data, profileId });

  redirect(`/dashboard/profiles/${profileId}/edit?tab=achievement`);
}

export async function updateProfileAchievement(
  { id, profileId }: { id: string; profileId: string },
  unsafeData: z.infer<typeof achievementSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = achievementSchema.safeParse(unsafeData);

  const errorMessage = "There was an error updating your achievement data";

  if (!success || userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await updateProfileAchievementDb(data, {
    id,
    profileId,
  });

  return {
    error: !isSuccess,
    message: isSuccess ? "Achievement details updated" : errorMessage,
  };
}

export async function deleteProfileAchievement({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const errorMessage = "There was an error deleting your achievement";

  if (userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await deleteProfileAchievementDb({ profileId, id });

  return {
    error: !isSuccess,
    message: isSuccess ? "Achievement deleted successfully" : errorMessage,
  };
}
