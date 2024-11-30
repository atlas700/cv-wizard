import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { DeleteProfileAchievementAlertDialogContent } from "./DeleteProfileAchievmentAlertDialogContent";

export function AchievementsGrid({
  userProfileAchievements,
}: {
  userProfileAchievements: {
    id: string;
    date: string | null;
    description: string | null;
    profileId: string;
    title: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userProfileAchievements.map((profile) => (
        <AchievementCard key={profile.id} {...profile} />
      ))}
    </div>
  );
}

export function AchievementCard({
  id,
  date,
  description,
  profileId,
  title,
}: {
  id: string;
  date: string | null;
  description: string | null;
  profileId: string;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link
              href={`/dashboard/profiles/${profileId}/achievements/${id}/edit`}
            >
              {title}
            </Link>
          </CardTitle>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="size-8 p-0">
                  <div className="sr-only">Action Menu</div>
                  <DotsHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/profiles/${profileId}/achievements/${id}/edit`}
                  >
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteProfileAchievementAlertDialogContent
              id={id}
              profileId={profileId}
            />
          </AlertDialog>
        </div>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      {date && <CardFooter>{date}</CardFooter>}
    </Card>
  );
}
