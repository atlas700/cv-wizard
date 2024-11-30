import { db } from "@/db";
import { ProfileTable } from "@/db/schema";
import {
  CACHE_TAGS,
  dbCache,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { and, eq, count } from "drizzle-orm";

export async function createProfile(data: typeof ProfileTable.$inferInsert) {
  const [newProfile] = await db
    .insert(ProfileTable)
    .values(data)
    .onConflictDoNothing({
      target: ProfileTable.id,
    })
    .returning({ id: ProfileTable.id, userId: ProfileTable.clerkUserId });

  console.info("REQUEST FLOW TARGET: ");

  revalidateDbCache({
    tag: CACHE_TAGS.profiles,
    id: newProfile.id,
    userId: newProfile.userId,
  });

  return { id: newProfile.id };
}

export async function updateProfile(
  data: Partial<typeof ProfileTable.$inferInsert>,
  { id, userId }: { id: string; userId: string }
) {
  const { rowCount } = await db
    .update(ProfileTable)
    .set(data)
    .where(and(eq(ProfileTable.clerkUserId, userId), eq(ProfileTable.id, id)));

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id,
      userId,
    });
  }

  return rowCount > 0;
}

export async function deleteProfile({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const { rowCount } = await db
    .delete(ProfileTable)
    .where(and(eq(ProfileTable.clerkUserId, userId), eq(ProfileTable.id, id)));

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id,
      userId,
    });
  }

  return rowCount > 0;
}

export async function getProfiles(
  userId: string,
  { limit }: { limit?: number }
) {
  const cacheFn = dbCache(getProfilesInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.profiles)],
  });

  return cacheFn(userId, { limit });
}

export async function getProfile({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const cacheFn = dbCache(getProfileInternal, {
    tags: [getIdTag(id, CACHE_TAGS.profiles)],
  });

  return cacheFn({ id, userId });
}

// counts
export function getProfileCount(userId: string) {
  const cacheFn = dbCache(getProfileCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.profiles)],
  });

  return cacheFn(userId);
}

// internals
function getProfilesInternal(userId: string, { limit }: { limit?: number }) {
  return db.query.ProfileTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    limit,
  });
}

function getProfileInternal({ id, userId }: { id: string; userId: string }) {
  return db.query.ProfileTable.findFirst({
    where: ({ clerkUserId, id: idCol }, { eq, and }) =>
      and(eq(clerkUserId, userId), eq(idCol, id)),
  });
}

async function getProfileCountInternal(userId: string) {
  const counts = await db
    .select({ profileCount: count() })
    .from(ProfileTable)
    .where(eq(ProfileTable.clerkUserId, userId));

  return counts[0]?.profileCount ?? 0;
}
