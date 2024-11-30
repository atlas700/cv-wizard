import { db } from "@/db";
import { AchievementsTable } from "@/db/schema";
import { CACHE_TAGS, dbCache, getIdTag, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function getProfileAchievements({
  profileId,
}: {
  profileId: string;
}) {
  const cacheFn = dbCache(getProfileAchievementsInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId });
}

export async function getProfileAchievement({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const cacheFn = dbCache(getProfileAchievementInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId, id });
}

export async function createProfileAchievement(
  data: typeof AchievementsTable.$inferInsert
) {
  const [newAchievement] = await db
    .insert(AchievementsTable)
    .values(data)
    .returning({
      id: AchievementsTable.id,
      profileId: AchievementsTable.profileId,
    });

  if (newAchievement != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: newAchievement.profileId,
    });
  }

  return newAchievement.id;
}

export async function updateProfileAchievement(
  data: Partial<typeof AchievementsTable.$inferInsert>,
  { id, profileId }: { id: string; profileId: string }
) {
  const { rowCount } = await db
    .update(AchievementsTable)
    .set(data)
    .where(
      and(
        eq(AchievementsTable.id, id),
        eq(AchievementsTable.profileId, profileId)
      )
    );

  if (rowCount > 0) {
    revalidateDbCache({ tag: CACHE_TAGS.profiles, id: profileId });
  }

  return rowCount;
}

export async function deleteProfileAchievement({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const { rowCount } = await db
    .delete(AchievementsTable)
    .where(
      and(
        eq(AchievementsTable.profileId, profileId),
        eq(AchievementsTable.id, id)
      )
    );

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: profileId,
    });
  }

  return rowCount > 0;
}

async function getProfileAchievementsInternal({
  profileId,
}: {
  profileId: string;
}) {
  const data = await db.query.AchievementsTable.findMany({
    where: ({ profileId: profileIdCol }, { eq }) => eq(profileIdCol, profileId),
  });

  return data;
}

async function getProfileAchievementInternal({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const data = await db.query.AchievementsTable.findFirst({
    where: ({ profileId: profileIdCol, id: idCol }, { eq, and }) =>
      and(eq(profileIdCol, profileId), eq(idCol, id)),
  });

  return data;
}
