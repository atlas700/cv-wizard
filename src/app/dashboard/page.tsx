import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProfiles } from "@/server/db/profiles";
import { auth } from "@clerk/nextjs/server";
import { ArrowRightIcon, ChevronDownIcon, StarsIcon } from "lucide-react";
import Link from "next/link";
import { NoProfiles } from "./_components/NoProfiles";
import { ProfileGrid } from "./_components/ProfileGrid";

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const userProfiles = await getProfiles(userId, { limit: 6 });

  if (userProfiles.length === 0) return <NoProfiles />;

  return (
    <>
      <h2 className="mb-6 text-3xl font-semibold flex justify-between">
        <Link
          className="group flex gap-2 items-center hover:underline"
          href="/dashboard/profiles"
        >
          Profiles
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Create CV
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button asChild variant={"ghost"}>
                <Link href="/dashboard/profiles/new/ai">
                  Create by AI <StarsIcon className="size-0.5 self-start" />
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button asChild variant={"ghost"}>
                <Link href="/dashboard/profiles/new">Custom</Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </h2>
      <ProfileGrid userProfiles={userProfiles} />
    </>
  );
}
