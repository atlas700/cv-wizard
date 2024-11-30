import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  subscriptionTiers,
  subscriptionTiersInOrder,
  TierNames,
} from "@/data/subscriptionTiers";
import { cn } from "@/lib/utils";
import {
  createCancelSession,
  createCheckoutSession,
  createCustomerPortalSession,
} from "@/server/actions/stripe";
import { getProfileCount, getProfiles } from "@/server/db/profiles";
import { getUserSubscriptionTier } from "@/server/db/subscription";
import { auth } from "@clerk/nextjs/server";
import { CheckIcon } from "lucide-react";
import { ReactNode } from "react";

export default async function SubscriptionPage() {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const tier = await getUserSubscriptionTier(userId);
  const profileCount = await getProfileCount(userId);
  const profileCreatedThisMonth = await getProfiles(userId, { limit: 100 });

  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold">Your Subscription</h1>
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Usage</CardTitle>
              <CardDescription>
                {profileCreatedThisMonth.length} / mo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={
                  (profileCreatedThisMonth.length / tier.maxCVCreations) * 100
                }
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Number of Profile</CardTitle>
              <CardDescription>
                {profileCount} / {tier.maxCVCreations} CV created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(profileCount / tier.maxCVCreations) * 100} />
            </CardContent>
          </Card>
        </div>

        {tier != subscriptionTiers.Free && (
          <Card>
            <CardHeader>
              <CardTitle>You are currently on the {tier.name} plan</CardTitle>
              <CardDescription>
                If you would like to upgrade, cancel, or change your payment
                method use the button below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                // @ts-expect-error
                action={createCustomerPortalSession}
              >
                <Button
                  variant="accent"
                  className="text-lg rounded-lg"
                  size="lg"
                >
                  Manage Subscription
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid-cols-2 lg:grid-cols-4 grid gap-4 max-w-screen-xl mx-auto">
        {subscriptionTiersInOrder.map((t) => (
          <PricingCard key={t.name} currentTierName={tier.name} {...t} />
        ))}
      </div>
    </>
  );
}

function PricingCard({
  name,
  priceInCents,
  maxCVCreations,
  canRemoveBranding,
  canDownloadAsPDF,
  canAccessAIContent,
  canCustomizeTemplates,
  currentTierName,
}: (typeof subscriptionTiersInOrder)[number] & { currentTierName: TierNames }) {
  const isCurrent = currentTierName === name;

  return (
    <Card className="shadow-none rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>{maxCVCreations} / mo</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          // @ts-expect-error
          action={
            name === "Free"
              ? createCancelSession
              : createCheckoutSession.bind(null, name)
          }
        >
          <Button
            disabled={isCurrent}
            className="text-lg w-full rounded-lg"
            size="lg"
          >
            {isCurrent ? "Current" : "Swap"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxCVCreations} {maxCVCreations === 1 ? "CV" : "CVs"}
        </Feature>
        <Feature>CV-Wizard discounts</Feature>
        {canAccessAIContent && <Feature>AI CV Contents</Feature>}
        {canRemoveBranding && <Feature>Remove CV-Wizard branding</Feature>}
        {canCustomizeTemplates && <Feature>Customize Templates</Feature>}
        {canDownloadAsPDF && <Feature>Download PDFs</Feature>}
      </CardFooter>
    </Card>
  );
}

function Feature({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
}
