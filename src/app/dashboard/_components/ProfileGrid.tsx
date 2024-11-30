import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { DeleteProfileAlertDialogContent } from "./DeleteProfileAlertDialogContent";

export function ProfileGrid({
  userProfiles,
}: {
  userProfiles: {
    id: string;
    clerkUserId: string;
    linkedin: string | null;
    firstName: string;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    bio: string | null;
    location: string | null;
    portfolio: string | null;
    profession: string;
    profileImage: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userProfiles.map((profile) => (
        <ProductCard key={profile.id} {...profile} />
      ))}
    </div>
  );
}

export function ProductCard({
  id,
  clerkUserId,
  createdAt,
  linkedin,
  portfolio,
  updatedAt,
  bio,
  email,
  firstName,
  lastName,
  location,
  phoneNumber,
  profession,
  profileImage,
}: {
  id: string;
  clerkUserId: string;
  linkedin: string | null;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  bio: string | null;
  location: string | null;
  portfolio: string | null;
  profession: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link href={`/dashboard/profiles/${id}/edit`}>
              {firstName} - {profession}
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
                  <Link href={`/dashboard/profiles/${id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteProfileAlertDialogContent id={id} />
          </AlertDialog>
        </div>
        <CardDescription>
          {portfolio ? portfolio : linkedin ? linkedin : null}
        </CardDescription>
      </CardHeader>
      {bio && (
        <CardContent>
          {bio.substring(0, 100)}
          <svg
            className="ml-[4px] inline-block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 20"
            fill="currentColor"
            width="40"
            height="10"
          >
            <circle cx="10" cy="10" r="3"></circle>
            <circle cx="20" cy="10" r="3"></circle>
            <circle cx="30" cy="10" r="3"></circle>
          </svg>
        </CardContent>
      )}
    </Card>
  );
}
