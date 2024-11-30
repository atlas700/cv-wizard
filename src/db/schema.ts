import { subscriptionTiers, TierNames } from "@/data/subscriptionTiers";
import { relations } from "drizzle-orm";
import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

// Profile Table
export const ProfileTable = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull().unique(),
    clerkUserId: text("clerk_user_id").notNull(),
    linkedin: varchar("linkedin", { length: 255 }),
    firstName: varchar("first-name").notNull(),
    lastName: varchar("last-name"),
    email: varchar("email"),
    phoneNumber: varchar("phone-number"),
    bio: varchar("bio"),
    location: varchar("location"),
    portfolio: varchar("portfolio"),
    profession: varchar("profession").notNull(),
    profileImage: varchar("profile-image"),
    createdAt: createdAt,
    updatedAt: updatedAt,
  },
  (table) => ({
    clerkUserIdIndex: index("profiles.clerk_user_id_index").on(
      table.clerkUserId
    ),
  })
);

export const profileRelations = relations(ProfileTable, ({ one, many }) => ({
  educations: many(EducationTable),
  experiences: many(ExperienceTable),
  projects: many(ProjectsTable),
  skills: many(SkillsTable),
  achievements: many(AchievementsTable),
}));

// Education Table
export const EducationTable = pgTable("educations", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .references(() => ProfileTable.id, { onDelete: "cascade" })
    .notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 100 }),
  location: varchar("location", { length: 255 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
});

export const educationsRelations = relations(EducationTable, ({ one }) => ({
  profile: one(ProfileTable, {
    fields: [EducationTable.profileId],
    references: [ProfileTable.id],
  }),
}));

// Experience Table
export const ExperienceTable = pgTable("experiences", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .references(() => ProfileTable.id, { onDelete: "cascade" })
    .notNull(),
  jobTittle: varchar("job_title", { length: 100 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  description: text("description"),
});

export const experienceRelations = relations(ExperienceTable, ({ one }) => ({
  profile: one(ProfileTable, {
    fields: [ExperienceTable.profileId],
    references: [ProfileTable.id],
  }),
}));

// Skills Table
export const SkillsTable = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .references(() => ProfileTable.id, { onDelete: "cascade" })
    .notNull(),
  skillName: varchar("skill_name", { length: 100 }).notNull(),
});

export const skillRelations = relations(SkillsTable, ({ one }) => ({
  profile: one(ProfileTable, {
    fields: [SkillsTable.profileId],
    references: [ProfileTable.id],
  }),
}));

// Projects Table
export const ProjectsTable = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .references(() => ProfileTable.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  duration: varchar("duration", { length: 50 }),
  link: varchar("link", { length: 255 }),
});

export const projectsRelations = relations(ProjectsTable, ({ one }) => ({
  profile: one(ProfileTable, {
    fields: [ProjectsTable.profileId],
    references: [ProfileTable.id],
  }),
}));

// Achievements Table
export const AchievementsTable = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .references(() => ProfileTable.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: date("date"),
});

export const achievementsRelations = relations(
  AchievementsTable,
  ({ one }) => ({
    profile: one(ProfileTable, {
      fields: [AchievementsTable.profileId],
      references: [ProfileTable.id],
    }),
  })
);

export const TierEnum = pgEnum(
  "tier",
  Object.keys(subscriptionTiers) as [TierNames]
);

export const UserSubscriptionTable = pgTable(
  "user_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    stripeSubscriptionItemId: text("stripe_subscription_item_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    tier: TierEnum("tier").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    clerkUserIdIndex: index("user_subscriptions.clerk_user_id_index").on(
      table.clerkUserId
    ),
    stripeCustomerIdIndex: index(
      "user_subscriptions.stripe_customer_id_index"
    ).on(table.stripeCustomerId),
  })
);
