import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function NoProfileProjects({ profileId }: { profileId: string }) {
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">
        You have no project in this profile
      </h1>
      <p className="mb-4">
        No project is added to show, get started by adding the first project to
        add the existing profile
      </p>
      <Button variant={"accent"} size="lg" asChild>
        <Link href={`/dashboard/profiles/${profileId}/projects/new`}>
          <PlusIcon /> Add Project
        </Link>
      </Button>
    </div>
  );
}
