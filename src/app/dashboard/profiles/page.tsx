import { Button } from "@/components/ui/button";
import { getProfiles } from "@/server/db/profiles";
import { auth } from "@clerk/nextjs/server";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { NoProfiles } from "../_components/NoProfiles";
import { ProfileGrid } from "../_components/ProfileGrid";
import { PageWithBackButton } from "../_components/PageWithBackButton";

export default async function ProfilesPage() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const userProfiles = await getProfiles(userId, { limit: 6 });

  if (userProfiles.length === 0) return <NoProfiles />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold flex justify-between">
        Your Profiles
        <Button asChild>
          <Link href="/dashboard/profiles/new/cv-options">
            <PlusIcon className="size-4 mr-2" />
            New Profile
          </Link>
        </Button>
      </h1>
      <ProfileGrid userProfiles={userProfiles} />
    </div>
  );
}
