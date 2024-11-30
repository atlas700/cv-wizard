"use server";

import { projectSchema } from "@/schema/project";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createProfileProject as createProfileProjectDb,
  deleteProfileProject as deleteProfileProjectDb,
  updateProfileProject as updateProfileProjectDb,
} from "../db/project";

export async function createProfileProject(
  profileId: string,
  unsafeData: z.infer<typeof projectSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = projectSchema.safeParse(unsafeData);

  if (!success || userId == null)
    return {
      error: true,
      message: "There was an error saving your profile project data",
    };

  const id = await createProfileProjectDb({ profileId, ...data });

  redirect(`/dashboard/profiles/${profileId}/edit?tab=project`);
}

export async function updateProfileProject(
  { id, profileId }: { id: string; profileId: string },
  unsafeData: z.infer<typeof projectSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = projectSchema.safeParse(unsafeData);

  const errorMessage = "There was an error updating your project data";

  if (!success || userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await updateProfileProjectDb(data, {
    id,
    profileId,
  });

  return {
    error: !isSuccess,
    message: isSuccess ? "Project details updated" : errorMessage,
  };
}

export async function deleteProfileProject({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const errorMessage = "There was an error deleting your project";

  if (userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await deleteProfileProjectDb({ profileId, id });

  return {
    error: !isSuccess,
    message: isSuccess ? "Project deleted successfully" : errorMessage,
  };
}
