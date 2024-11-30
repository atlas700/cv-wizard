import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function NoProfileEducations({ profileId }: { profileId: string }) {
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">
        You have no education in this profile
      </h1>
      <p className="mb-4">
        No education is added to show, get started by adding the first education
        to add the existing profile
      </p>
      <Button variant={"accent"} size="lg" asChild>
        <Link href={`/dashboard/profiles/${profileId}/educations/new`}>
          <PlusIcon /> Add Education
        </Link>
      </Button>
    </div>
  );
}
