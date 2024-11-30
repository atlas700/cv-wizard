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
import { DeleteProfileEducationAlertDialogContent } from "./DeleteProfileEducationAlertDialogContent";

export function EducationGrid({
  userProfileEducation,
}: {
  userProfileEducation: {
    id: string;
    endDate: string | null;
    location: string | null;
    profileId: string;
    startDate: string | null;
    institution: string;
    degree: string | null;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userProfileEducation.map((profile) => (
        <EducationCard key={profile.id} {...profile} />
      ))}
    </div>
  );
}

export function EducationCard({
  id,
  endDate,
  location,
  profileId,
  startDate,
  institution,
  degree,
}: {
  id: string;
  endDate: string | null;
  location: string | null;
  profileId: string;
  startDate: string | null;
  institution: string;
  degree: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link
              href={`/dashboard/profiles/${profileId}/educations/${id}/edit`}
            >
              {institution} - {location}
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
                    href={`/dashboard/profiles/${profileId}/educations/${id}/edit`}
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
            <DeleteProfileEducationAlertDialogContent
              id={id}
              profileId={profileId}
            />
          </AlertDialog>
        </div>
        {degree ? <CardDescription>{degree}</CardDescription> : null}
      </CardHeader>
      {startDate && endDate && (
        <CardFooter>
          {startDate} - {endDate}
        </CardFooter>
      )}
    </Card>
  );
}
