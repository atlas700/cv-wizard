"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { achievementSchema } from "@/schema/achievement";
import {
  createProfileAchievement,
  updateProfileAchievement,
} from "@/server/actions/achievement";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function AchievementForm({
  profileAchievement,
  profileId,
}: {
  profileAchievement?: {
    title: string;
    id: string;
    profileId: string;
    date: string | null;
    description: string | null;
  };
  profileId: string;
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof achievementSchema>>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: profileAchievement?.title ?? "",
      date: profileAchievement?.date ?? "",
      description: profileAchievement?.description ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof achievementSchema>) {
    const action =
      profileAchievement == null
        ? createProfileAchievement.bind(null, profileId)
        : updateProfileAchievement.bind(null, {
            id: profileAchievement.id,
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
                  <Input placeholder="Award Name" type="text" {...field} />
                </FormControl>
                <FormDescription>Enter the Award name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(format(date, "yyyy-MM-dd"));
                          } else {
                            field.onChange("");
                          }
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormDescription>Add description</FormDescription>
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
