"use server";

import { personalInfoSchema } from "@/schema/profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createProfile as createProfileDb,
  deleteProfile as deleteProfileDb,
  updateProfile as updateProfileDb,
} from "../db/profiles";

export async function createProfile(
  unsafeData: z.infer<typeof personalInfoSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = personalInfoSchema.safeParse(unsafeData);

  if (!success || userId == null)
    return {
      error: true,
      message: "There was an error saving your profile data",
    };

  const { id } = await createProfileDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/profiles`);
}

export async function updateProfile(
  id: string,
  unsafeData: z.infer<typeof personalInfoSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const { data, success } = personalInfoSchema.safeParse(unsafeData);

  const errorMessage = "There was an error updating your profile data";

  if (!success || userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await updateProfileDb(data, { id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Profile details updated" : errorMessage,
  };
}

export async function deleteProfile(
  id: string
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();

  const errorMessage = "There was an error deleting your profile data";

  if (userId == null)
    return {
      error: true,
      message: errorMessage,
    };

  const isSuccess = await deleteProfileDb({ id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Profile deleted successfully" : errorMessage,
  };
}
