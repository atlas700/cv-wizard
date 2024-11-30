import { getProfileCount } from "./db/profiles";
import { getUserSubscriptionTier } from "./db/subscription";

export async function canRemoveBranding(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  return tier.canRemoveBranding;
}

export async function canCreateProfile(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  const profileCount = await getProfileCount(userId);
  return profileCount < tier.maxCVCreations;
}
