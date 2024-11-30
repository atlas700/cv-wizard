"use server";

import { educationSchema } from "@/schema/education";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createProfileEducation as createProfileEducationDb,
  deleteProfileEducation as deleteProfileEducationDb,
  updateProfileEducation as updateProfileEducationDb,
} from "../db/education";

export async function createProfileEducation(
  profileId: string,
  unsafeData: z.infer<typeof educationSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = educationSchema.safeParse(unsafeData);

  if (!success || userId == null)
    return {
      error: true,
      message: "There was an error saving your profile education data",
    };

  const id = await createProfileEducationDb({ ...data, profileId });

  redirect(`/dashboard/profiles/${profileId}/edit?tab=education`);
}

export async function updateProfileEducation(
  { id, profileId }: { id: string; profileId: string },
  unsafeData: z.infer<typeof educationSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = educationSchema.safeParse(unsafeData);

  const errorMessage = "There was an error updating your education data";

  if (!success || userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await updateProfileEducationDb(data, {
    id,
    userId,
    profileId,
  });

  return {
    error: !isSuccess,
    message: isSuccess ? "Education details updated" : errorMessage,
  };
}

export async function deleteProfileEducation({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const errorMessage = "There was an error deleting your education";

  if (userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await deleteProfileEducationDb({ profileId, id });

  return {
    error: !isSuccess,
    message: isSuccess ? "Education deleted successfully" : errorMessage,
  };
}
