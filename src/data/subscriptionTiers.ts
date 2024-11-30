// import { env } from "./env/server"

export type TierNames = keyof typeof subscriptionTiers;
export type PaidTierNames = Exclude<TierNames, "Free">;

export const subscriptionTiers = {
  Free: {
    name: "Free",
    priceInCents: 0,
    maxCVCreations: 1,
    canDownloadAsPDF: true,
    canAccessAIContent: true,
    canCustomizeTemplates: false,
    canRemoveBranding: false,
    stripePriceId: null,
  },
  Basic: {
    name: "Basic",
    priceInCents: 499,
    maxCVCreations: 10,
    canDownloadAsPDF: true,
    canAccessAIContent: true,
    canCustomizeTemplates: false,
    canRemoveBranding: false,
    stripePriceId: process.env.STRIPE_BASIC_PLAN_STRIPE_PRICE_ID,
  },
  Standard: {
    name: "Standard",
    priceInCents: 999,
    maxCVCreations: 50,
    canDownloadAsPDF: true,
    canAccessAIContent: true,
    canCustomizeTemplates: true,
    canRemoveBranding: true,
    stripePriceId: process.env.STRIPE_STANDARD_PLAN_STRIPE_PRICE_ID,
  },
  Premium: {
    name: "Premium",
    priceInCents: 1999,
    maxCVCreations: 100,
    canDownloadAsPDF: true,
    canAccessAIContent: true,
    canCustomizeTemplates: true,
    canRemoveBranding: true,
    prioritySupport: true,
    stripePriceId: process.env.STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID,
  },
} as const;

export const subscriptionTiersInOrder = [
  subscriptionTiers.Free,
  subscriptionTiers.Basic,
  subscriptionTiers.Standard,
  subscriptionTiers.Premium,
] as const;

export function getTierByPriceId(stripePriceId: string) {
  return Object.values(subscriptionTiers).find(
    (tier) => tier.stripePriceId === stripePriceId
  );
}
