import { db } from "@/db";
import { ExperienceTable } from "@/db/schema";
import { CACHE_TAGS, dbCache, getIdTag, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function getProfileExperience({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const cacheFn = dbCache(getProfileExperienceInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId, id });
}

export async function getProfileExperiences({
  profileId,
}: {
  profileId: string;
}) {
  const cacheFn = dbCache(getProfileExperiencesInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId });
}

export async function createProfileExperience(
  data: typeof ExperienceTable.$inferInsert
) {
  const [newExperience] = await db
    .insert(ExperienceTable)
    .values(data)
    .returning({
      id: ExperienceTable.id,
      profileId: ExperienceTable.profileId,
    });

  if (newExperience != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: newExperience.profileId,
    });
  }

  return newExperience.id;
}

export async function updateProfileExperience(
  data: Partial<typeof ExperienceTable.$inferInsert>,
  { id, userId, profileId }: { id: string; userId: string; profileId: string }
) {
  const { rowCount } = await db
    .update(ExperienceTable)
    .set(data)
    .where(
      and(eq(ExperienceTable.id, id), eq(ExperienceTable.profileId, profileId))
    );

  if (rowCount > 0) {
    revalidateDbCache({ tag: CACHE_TAGS.profiles, id: profileId });
  }

  return rowCount;
}

export async function deleteProfileExperience({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const { rowCount } = await db
    .delete(ExperienceTable)
    .where(
      and(eq(ExperienceTable.profileId, profileId), eq(ExperienceTable.id, id))
    );

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: profileId,
    });
  }

  return rowCount > 0;
}

async function getProfileExperienceInternal({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const data = await db.query.ExperienceTable.findFirst({
    where: ({ profileId: profileIdCol, id: idCol }, { eq, and }) =>
      and(eq(profileIdCol, profileId), eq(idCol, id)),
  });

  return data;
}

async function getProfileExperiencesInternal({
  profileId,
}: {
  profileId: string;
}) {
  const data = await db.query.ExperienceTable.findMany({
    where: ({ profileId: profileIdCol }, { eq }) => eq(profileIdCol, profileId),
  });

  return data;
}
