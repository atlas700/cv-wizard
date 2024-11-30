import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function NoProfileExperiences({ profileId }: { profileId: string }) {
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">
        You have no experience in this profile
      </h1>
      <p className="mb-4">
        No experience is added to show, get started by adding the first
        experience to add the existing profile
      </p>
      <Button variant={"accent"} size="lg" asChild>
        <Link href={`/dashboard/profiles/${profileId}/experiences/new`}>
          <PlusIcon /> Add Experience
        </Link>
      </Button>
    </div>
  );
}
