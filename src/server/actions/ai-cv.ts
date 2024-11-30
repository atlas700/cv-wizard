"use server";

import { db } from "@/db";
import {
  AchievementsTable,
  EducationTable,
  ExperienceTable,
  ProfileTable,
  ProjectsTable,
  SkillsTable,
} from "@/db/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import { eq, inArray } from "drizzle-orm";

interface AiGeneratedData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    bio: string;
    location: string;
    profession: string;
    createdAt: string;
    updatedAt: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
  }>;
  experience: Array<{
    jobTittle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    skillName: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    duration: string;
    link: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
}

export interface StoreAiDataProps {
  data: AiGeneratedData;
}

async function storeAiGeneratedData({ data }: StoreAiDataProps) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const user = await currentUser();

  if (!data) throw new Error("Data object is required");

  const insertedIds = {
    profileId: null as string | null,
    educationIds: [] as string[],
    experienceIds: [] as string[],
    skillsIds: [] as string[],
    projectsIds: [] as string[],
    achievementsIds: [] as string[],
  };

  try {
    const [profile] = await db
      .insert(ProfileTable)
      .values({
        clerkUserId: userId,
        firstName: data?.profile?.firstName ?? user?.firstName,
        lastName: data?.profile?.lastName ?? user?.lastName,
        email: data?.profile?.email ?? user?.primaryEmailAddress?.emailAddress,
        phoneNumber:
          data?.profile?.phoneNumber ?? user?.primaryPhoneNumber?.phoneNumber,
        profileImage: user?.imageUrl ?? null,
        bio: data?.profile?.bio ?? null,
        location: data?.profile?.location ?? null,
        profession: data?.profile?.profession ?? "Manager",
      })
      .returning({ id: ProfileTable.id });

    if (!profile?.id) throw new Error("Failed to insert profile");

    insertedIds.profileId = profile.id;

    // Insert education
    for (const edu of data.education) {
      const [result] = await db
        .insert(EducationTable)
        .values({
          profileId: profile.id,
          degree: edu.degree ?? null,
          institution: edu?.institution ?? "MIT",
          startDate: isValidDateFormat(edu?.startDate)
            ? edu.startDate.toString()
            : null,
          endDate: isValidDateFormat(edu?.endDate)
            ? edu.endDate.toString()
            : null,
          location: edu?.location ?? null,
        })
        .returning({ id: EducationTable.id });

      insertedIds.educationIds.push(result.id);
    }

    // Insert experience
    for (const expe of data.experience) {
      const [result] = await db
        .insert(ExperienceTable)
        .values({
          profileId: profile.id,
          jobTittle: expe?.jobTittle ?? "Senior Software Engineer",
          company: expe?.company ?? "Google",
          startDate: isValidDateFormat(expe?.startDate)
            ? expe.startDate.toString()
            : null,
          endDate: isValidDateFormat(expe?.endDate)
            ? expe.endDate.toString()
            : null,
          location: expe.location ?? null,
        })
        .returning({ id: ExperienceTable.id });

      insertedIds.experienceIds.push(result.id);
    }

    // Insert skill
    for (const skill of data.skills) {
      const [result] = await db
        .insert(SkillsTable)
        .values({
          profileId: profile.id,
          skillName: skill?.skillName ?? "MS Word",
        })
        .returning({ id: SkillsTable.id });

      insertedIds.skillsIds.push(result.id);
    }

    // Insert project
    for (const proj of data.projects) {
      const [result] = await db
        .insert(ProjectsTable)
        .values({
          profileId: profile.id,
          title: proj?.title ?? "Cloud Solution",
          description: proj?.description ?? null,
          duration: proj?.duration ?? null,
          link: proj?.link ?? null,
        })
        .returning({ id: ProjectsTable.id });

      insertedIds.projectsIds.push(result.id);
    }

    // Insert Achievements
    for (const achiv of data.achievements) {
      const [result] = await db
        .insert(AchievementsTable)
        .values({
          profileId: profile.id,
          title: achiv?.title ?? "Student of the year",
          description: achiv?.description ?? null,
          date: isValidDateFormat(achiv?.date) ? achiv.date.toString() : null,
        })
        .returning({ id: AchievementsTable.id });

      insertedIds.achievementsIds.push(result.id);
    }

    if (profile.id != null) {
      revalidateDbCache({
        tag: CACHE_TAGS.profiles,
        userId,
        id: profile.id,
      });
    }

    return { success: true, profileId: profile.id };
  } catch (error) {
    // Rollback: delete inserted rows in reverse order
    if (insertedIds.achievementsIds.length) {
      await db
        .delete(AchievementsTable)
        .where(inArray(AchievementsTable.id, insertedIds.achievementsIds));
    }
    if (insertedIds.projectsIds.length) {
      await db
        .delete(ProjectsTable)
        .where(inArray(ProjectsTable.id, insertedIds.projectsIds));
    }
    if (insertedIds.skillsIds.length) {
      await db
        .delete(SkillsTable)
        .where(inArray(SkillsTable.id, insertedIds.skillsIds));
    }
    if (insertedIds.educationIds.length) {
      await db
        .delete(EducationTable)
        .where(inArray(EducationTable.id, insertedIds.educationIds));
    }
    if (insertedIds.profileId) {
      await db
        .delete(ProfileTable)
        .where(eq(ProfileTable.id, insertedIds.profileId));
    }

    console.error("Rollback complete:", error);
    throw error;
  }
}

// Helper function to validate dates
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export { storeAiGeneratedData, type AiGeneratedData };

function isValidDateFormat(date: unknown): boolean {
  if (!date) return false;

  // If it's already a Date object
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  // If it's a string, check YYYY-MM-DD format
  if (typeof date === "string") {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(date)) return false;

    // Validate if it's a real date (e.g., not 2023-02-31)
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }

  return false;
}
