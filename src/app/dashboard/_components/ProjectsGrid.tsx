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
import { DeleteProfileProjectAlertDialogContent } from "./DeleteProfileProjectAlertDialogContent";

export function ProjectsGrid({
  userProfileProject,
}: {
  userProfileProject: {
    id: string;
    link: string | null;
    description: string | null;
    profileId: string;
    title: string;
    duration: string | null;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userProfileProject.map((profile) => (
        <ProjectCard key={profile.id} {...profile} />
      ))}
    </div>
  );
}

export function ProjectCard({
  id,
  link,
  description,
  profileId,
  title,
  duration,
}: {
  id: string;
  link: string | null;
  description: string | null;
  profileId: string;
  title: string;
  duration: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link href={`/dashboard/profiles/${profileId}/projects/${id}/edit`}>
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
                    href={`/dashboard/profiles/${profileId}/projects/${id}/edit`}
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
            <DeleteProfileProjectAlertDialogContent
              id={id}
              profileId={profileId}
            />
          </AlertDialog>
        </div>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : link ? (
          <CardDescription>{link}</CardDescription>
        ) : null}
      </CardHeader>
      {duration && <CardFooter>{duration}</CardFooter>}
    </Card>
  );
}
