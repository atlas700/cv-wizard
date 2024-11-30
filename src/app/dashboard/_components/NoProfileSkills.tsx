import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function NoProfileSkills({ profileId }: { profileId: string }) {
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">
        You have no skills in this profile
      </h1>
      <p className="mb-4">
        No skill is added to show, get started by adding the first skill to add
        the existing profile
      </p>
      <Button variant={"accent"} size="lg" asChild>
        <Link href={`/dashboard/profiles/${profileId}/skills/new`}>
          <PlusIcon /> Add Skill
        </Link>
      </Button>
    </div>
  );
}
