"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { projectSchema } from "@/schema/project";
import {
  createProfileProject,
  updateProfileProject,
} from "@/server/actions/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function ProjectForm({
  profileProject,
  profileId,
}: {
  profileProject?: {
    id: string;
    link: string | null;
    description: string | null;
    profileId: string;
    title: string;
    duration: string | null;
  };
  profileId: string;
}) {
  const { toast } = useToast();

  console.log(profileProject);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: profileProject?.title ?? "",
      link: profileProject?.link ?? "",
      description: profileProject?.description ?? "",
      duration: profileProject?.duration ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    const action =
      profileProject == null
        ? createProfileProject.bind(null, profileId)
        : updateProfileProject.bind(null, {
            id: profileProject.id,
            profileId,
          });

    const data = await action(values);

    if (data?.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 py-10 flex flex-col"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Project Title" type="text" {...field} />
                </FormControl>
                <FormDescription>Enter the Project title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL (Link)</FormLabel>
                <FormControl>
                  <Input placeholder="Link" type="url" {...field} />
                </FormControl>
                <FormDescription>Enter URL of your project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completing Time (Duration)</FormLabel>
                <FormControl>
                  <Input placeholder="Duration" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the time that project is completed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="resize-none overflow-y-auto min-h-20 font-sans text-base"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter any description about the project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="self-end"
        >
          Save and Continue
          {form.formState.isSubmitting && (
            <Loader2
              className="ml-1.5
          animate-spin size-5"
            />
          )}
        </Button>
      </form>
    </Form>
  );
}
