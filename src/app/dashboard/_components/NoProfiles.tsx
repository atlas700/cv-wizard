import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, PlusIcon, StarsIcon } from "lucide-react";
import Link from "next/link";

export function NoProfiles() {
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">You have no profiles</h1>
      <p className="mb-4">
        Get started with creating new profile for creating and downloading your
        first cv
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Create Profile
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
    </div>
  );
}
