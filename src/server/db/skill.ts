import { db } from "@/db";
import { SkillsTable } from "@/db/schema";
import { CACHE_TAGS, dbCache, getIdTag, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function getProfileSkills({ profileId }: { profileId: string }) {
  const cacheFn = dbCache(getProfileSkillsInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId });
}

export async function createProfileSkill(
  data: (typeof SkillsTable.$inferInsert)[]
) {
  const [newSkills] = await db.insert(SkillsTable).values(data).returning({
    id: SkillsTable.id,
    profileId: SkillsTable.profileId,
  });

  if (newSkills != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: newSkills.profileId,
    });
  }

  return newSkills.id;
}

export async function updateProfileSkill(
  data: (typeof SkillsTable.$inferInsert)[],
  { userId, profileId }: { userId: string; profileId: string }
) {
  await db.delete(SkillsTable).where(eq(SkillsTable.profileId, profileId));

  let { rowCount } = await db.insert(SkillsTable).values(data);

  if (rowCount > 0) {
    revalidateDbCache({ tag: CACHE_TAGS.profiles, id: profileId });
  }

  return rowCount;
}

export async function deleteProfileSkill({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const { rowCount } = await db
    .delete(SkillsTable)
    .where(and(eq(SkillsTable.profileId, profileId), eq(SkillsTable.id, id)));

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: profileId,
    });
  }

  return rowCount > 0;
}

async function getProfileSkillsInternal({ profileId }: { profileId: string }) {
  const data = await db.query.SkillsTable.findMany({
    where: ({ profileId: profileIdCol }, { eq }) => eq(profileIdCol, profileId),
  });

  return data;
}
