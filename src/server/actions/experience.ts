"use server";

import { experienceSchema } from "@/schema/experience";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createProfileExperience as createProfileExperienceDb,
  deleteProfileExperience as deleteProfileExperienceDb,
  updateProfileExperience as updateProfileExperienceDb,
} from "../db/experience";

export async function createProfileExperience(
  profileId: string,
  unsafeData: z.infer<typeof experienceSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = experienceSchema.safeParse(unsafeData);

  if (!success || userId == null)
    return {
      error: true,
      message: "There was an error saving your profile experience data",
    };

  const id = await createProfileExperienceDb({ ...data, profileId });

  redirect(`/dashboard/profiles/${profileId}/edit?tab=experience`);
}

export async function updateProfileExperience(
  { id, profileId }: { id: string; profileId: string },
  unsafeData: z.infer<typeof experienceSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = experienceSchema.safeParse(unsafeData);

  const errorMessage = "There was an error updating your profile data";

  if (!success || userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await updateProfileExperienceDb(data, {
    id,
    userId,
    profileId,
  });

  return {
    error: !isSuccess,
    message: isSuccess ? "Profile details updated" : errorMessage,
  };
}

export async function deleteProfileExperience({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const errorMessage = "There was an error deleting your experience";

  if (userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await deleteProfileExperienceDb({ profileId, id });

  return {
    error: !isSuccess,
    message: isSuccess ? "Experience deleted successfully" : errorMessage,
  };
}
