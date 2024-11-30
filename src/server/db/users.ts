import { db } from "@/db";
import { ProfileTable, UserSubscriptionTable } from "@/db/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

export async function deleteUser(clerkUserId: string) {
  const [userSubscriptions, profiles] = await db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
      .returning({
        id: UserSubscriptionTable.id,
        userId: UserSubscriptionTable.clerkUserId,
      }),
    db
      .delete(ProfileTable)
      .where(eq(ProfileTable.clerkUserId, clerkUserId))
      .returning({
        id: ProfileTable.id,
        userId: ProfileTable.clerkUserId,
      }),
  ]);

  userSubscriptions.forEach((subscription) => {
    return revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: subscription.id,
      userId: subscription.userId,
    });
  });
  profiles.forEach((profile) => {
    return revalidateDbCache({
      tag: CACHE_TAGS.profiles,
      id: profile.id,
      userId: profile.userId,
    });
  });

  return [userSubscriptions, profiles];
}
