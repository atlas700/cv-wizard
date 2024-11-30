import { db } from "@/db";
import { ProjectsTable } from "@/db/schema";
import { CACHE_TAGS, dbCache, getIdTag, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function getProfileProjects({ profileId }: { profileId: string }) {
  const cacheFn = dbCache(getProfileProjectsInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId });
}

export async function getProfileProject({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const cacheFn = dbCache(getProfileProjectInternal, {
    tags: [getIdTag(profileId, CACHE_TAGS.profiles)],
  });

  return cacheFn({ profileId, id });
}

export async function createProfileProject(
  data: typeof ProjectsTable.$inferInsert
) {
  const [newProject] = await db.insert(ProjectsTable).values(data).returning({
    id: ProjectsTable.id,
    profileId: ProjectsTable.profileId,
  });

  if (newProject != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: newProject.profileId,
    });
  }

  return newProject.id;
}

export async function updateProfileProject(
  data: Partial<typeof ProjectsTable.$inferInsert>,
  { id, profileId }: { id: string; profileId: string }
) {
  const { rowCount } = await db
    .update(ProjectsTable)
    .set(data)
    .where(
      and(eq(ProjectsTable.id, id), eq(ProjectsTable.profileId, profileId))
    );

  if (rowCount > 0) {
    revalidateDbCache({ tag: CACHE_TAGS.profiles, id: profileId });
  }

  return rowCount;
}

export async function deleteProfileProject({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const { rowCount } = await db
    .delete(ProjectsTable)
    .where(
      and(eq(ProjectsTable.profileId, profileId), eq(ProjectsTable.id, id))
    );

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: profileId,
    });
  }

  return rowCount > 0;
}

async function getProfileProjectsInternal({
  profileId,
}: {
  profileId: string;
}) {
  const data = await db.query.ProjectsTable.findMany({
    where: ({ profileId: profileIdCol }, { eq }) => eq(profileIdCol, profileId),
  });

  return data;
}

async function getProfileProjectInternal({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const data = await db.query.ProjectsTable.findFirst({
    where: ({ profileId: profileIdCol, id: idCol }, { eq, and }) =>
      and(eq(profileIdCol, profileId), eq(idCol, id)),
  });

  return data;
}
