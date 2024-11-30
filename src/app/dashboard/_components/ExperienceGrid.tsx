import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { DeleteProfileExperienceAlertDialogContent } from "./DeleteProfileExperienceAlertDialogContent";

export function ExperienceGrid({
  userProfileExperience,
}: {
  userProfileExperience: {
    id: string;
    location: string | null;
    description: string | null;
    profileId: string;
    startDate: string | null;
    endDate: string | null;
    jobTittle: string;
    company: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userProfileExperience.map((profile) => (
        <ExperienceCard key={profile.id} {...profile} />
      ))}
    </div>
  );
}

export function ExperienceCard({
  id,
  company,
  description,
  endDate,
  jobTittle,
  location,
  profileId,
  startDate,
}: {
  id: string;
  location: string | null;
  description: string | null;
  profileId: string;
  startDate: string | null;
  endDate: string | null;
  jobTittle: string;
  company: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link
              href={`/dashboard/profiles/${profileId}/experiences/${id}/edit`}
            >
              {jobTittle} - {company}
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
                    href={`/dashboard/profiles/${profileId}/experiences/${id}/edit`}
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
            <DeleteProfileExperienceAlertDialogContent
              id={id}
              profileId={profileId}
            />
          </AlertDialog>
        </div>
        <CardDescription>
          {location ? location : description ? description : null}
        </CardDescription>
      </CardHeader>
      {description && <CardContent>{description}</CardContent>}
      {startDate && endDate && (
        <CardFooter>
          {startDate} - {endDate}
        </CardFooter>
      )}
    </Card>
  );
}
