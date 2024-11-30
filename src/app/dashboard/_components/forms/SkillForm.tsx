"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { skillSchema } from "@/schema/skill";
import { createProfileSkill, updateProfileSkill } from "@/server/actions/skill";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

export default function SkillForm({
  profileId,
  profileSkills,
}: {
  profileId: string;
  profileSkills?: {
    profileId: string;
    id: string;
    skillName: string;
  }[];
}) {
  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: profileSkills?.map((skill) => ({
        skillName: skill.skillName,
      })) ?? [{ skillName: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  async function onSubmit(values: z.infer<typeof skillSchema>) {
    if (profileSkills?.length != 0) {
      const data = await updateProfileSkill(profileId, values);
      if (data?.message) {
        toast({
          title: data.error ? "Error" : "Success",
          description: data.message,
          variant: data.error ? "destructive" : "default",
        });
      }
    } else {
      const data = await createProfileSkill(profileId, values);
      if (data?.message) {
        toast({
          title: data.error ? "Error" : "Success",
          description: data.message,
          variant: data.error ? "destructive" : "default",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Add your professional skills
          </p>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex">
            <FormField
              control={form.control}
              name={`skills.${index}.skillName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                    Skill Name
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input {...field} placeholder="Enter skill name" />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        <div className="flex-col flex gap-3">
          <Button
            type="button"
            variant={"outline"}
            size="sm"
            className="self-start mt-2"
            onClick={() => append({ skillName: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
          </Button>
          <Button type="submit" className="self-end">
            Save and continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
