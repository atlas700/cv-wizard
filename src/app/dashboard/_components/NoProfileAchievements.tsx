import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function NoProfileAchievements({ profileId }: { profileId: string }) {
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">
        You have no achievement in this profile
      </h1>
      <p className="mb-4">
        No achievement is added to show, get started by adding the first
        achievement to add the existing profile
      </p>
      <Button variant={"accent"} size="lg" asChild>
        <Link href={`/dashboard/profiles/${profileId}/achievements/new`}>
          <PlusIcon /> Add Achievement
        </Link>
      </Button>
    </div>
  );
}
