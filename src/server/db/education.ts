import { db } from "@/db";
import { EducationTable } from "@/db/schema";
import { CACHE_TAGS, dbCache, getIdTag, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function getProfileEducations({
  profileId,
}: {
  profileId: string;
}) {
  const cacheFn = dbCache(getProfileEducationsInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId });
}

export async function getProfileEducation({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const cacheFn = dbCache(getProfileEducationInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId, id });
}

export async function createProfileEducation(
  data: typeof EducationTable.$inferInsert
) {
  const [newEducation] = await db
    .insert(EducationTable)
    .values(data)
    .returning({
      id: EducationTable.id,
      profileId: EducationTable.profileId,
    });

  if (newEducation != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: newEducation.profileId,
    });
  }

  return newEducation.id;
}

export async function updateProfileEducation(
  data: Partial<typeof EducationTable.$inferInsert>,
  { id, userId, profileId }: { id: string; userId: string; profileId: string }
) {
  const { rowCount } = await db
    .update(EducationTable)
    .set(data)
    .where(
      and(eq(EducationTable.id, id), eq(EducationTable.profileId, profileId))
    );

  if (rowCount > 0) {
    revalidateDbCache({ tag: CACHE_TAGS.profiles, id: profileId });
  }

  return rowCount;
}

export async function deleteProfileEducation({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const { rowCount } = await db
    .delete(EducationTable)
    .where(
      and(eq(EducationTable.profileId, profileId), eq(EducationTable.id, id))
    );

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: profileId,
    });
  }

  return rowCount > 0;
}

async function getProfileEducationsInternal({
  profileId,
}: {
  profileId: string;
}) {
  const data = await db.query.EducationTable.findMany({
    where: ({ profileId: profileIdCol }, { eq }) => eq(profileIdCol, profileId),
  });

  return data;
}

async function getProfileEducationInternal({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const data = await db.query.EducationTable.findFirst({
    where: ({ profileId: profileIdCol, id: idCol }, { eq, and }) =>
      and(eq(profileIdCol, profileId), eq(idCol, id)),
  });

  return data;
}
