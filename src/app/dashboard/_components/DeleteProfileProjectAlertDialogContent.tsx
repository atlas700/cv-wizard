"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteProfileProject } from "@/server/actions/project";
import { useTransition } from "react";

export function DeleteProfileProjectAlertDialogContent({
  profileId,
  id,
}: {
  profileId: string;
  id: string;
}) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          project.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            startDeleteTransition(async () => {
              const data = await deleteProfileProject({ profileId, id });
              if (data?.message) {
                toast({
                  title: data.error ? "Error" : "Success",
                  description: data.message,
                  variant: data.error ? "destructive" : "default",
                });
              }
            });
          }}
          disabled={isDeletePending}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}