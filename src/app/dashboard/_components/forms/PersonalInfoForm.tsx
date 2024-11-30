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
import { personalInfoSchema } from "@/schema/profile";
import { createProfile, updateProfile } from "@/server/actions/profiles";
import { zodResolver } from "@hookform/resolvers/zod";
import { PutBlobResult } from "@vercel/blob";
import { Loader2 } from "lucide-react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function PersonalInfoForm({
  userProfile,
}: {
  userProfile?: {
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
  };
}) {
  const { toast } = useToast();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      bio: userProfile?.bio ?? "",
      email: userProfile?.email ?? "",
      firstName: userProfile?.firstName ?? "",
      lastName: userProfile?.lastName ?? "",
      location: userProfile?.location ?? "",
      phoneNumber: userProfile?.phoneNumber ?? "",
      portfolio: userProfile?.portfolio ?? "",
      profession: userProfile?.profession ?? "",
      profileImage: blob?.url
        ? blob.url
        : userProfile?.profileImage
        ? userProfile.profileImage
        : "",
    },
  });

  async function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    const action =
      userProfile == null
        ? createProfile
        : updateProfile.bind(null, userProfile.id);

    const data = await action({
      ...values,
      profileImage: blob?.url ? blob.url : values.profileImage,
    });

    if (data?.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  }

  async function onImageUpload(event: FormEvent) {
    event.preventDefault();

    setImageUploading(true);
    try {
      if (!inputFileRef.current?.files) {
        return toast({
          title: "Error",
          description: "No file selected",
          variant: "destructive",
        });
      }

      const file = inputFileRef.current.files[0];

      const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const newBlob = (await response.json()) as PutBlobResult;

      setBlob(newBlob);
      toast({
        title: "Success",
        description: "Successfully saved your uploaded image",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to upload your profile image please try again",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  }

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // @ts-expect-error
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="max-w-md mt-3">
        <form
          id="uploadForm"
          onSubmit={onImageUpload}
          className="flex gap-3 items-center"
        >
          <div className="flex items-center gap-5">
            <img
              src={
                imageSrc
                  ? imageSrc
                  : blob?.url
                  ? blob.url
                  : form.formState.defaultValues?.profileImage
                  ? form.formState.defaultValues.profileImage
                  : "/logo.jpeg"
              }
              alt="profile image"
              width={60}
              height={60}
              className="border border-background rounded-sm"
            />
            <Input
              ref={inputFileRef}
              id="image"
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              disabled={imageUploading}
              variant={"outline"}
              name="uploadImageSubmitButton"
              formTarget="uploadForm"
              type="submit"
            >
              Save{" "}
              {imageUploading && <Loader2 className="size-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 py-10 flex flex-col"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" type="text" {...field} />
                  </FormControl>
                  <FormDescription>Enter your first name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" type="text" {...field} />
                  </FormControl>
                  <FormDescription>Enter your last name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter your email address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="(123) 999 999" {...field} />
                  </FormControl>
                  <FormDescription>Enter your phone number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bio"
                      className="resize-none overflow-y-auto min-h-20 font-sans text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter a bio of yourself.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lashkar Gah, Helmand Afghanistan"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter your living address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio</FormLabel>
                  <FormControl>
                    <Input placeholder="Portfolio" type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your portfolio link if exist
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profession</FormLabel>
                  <FormControl>
                    <Input placeholder="Profession" type="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your profession (Doctor, Engineer or Literature)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="self-end mt-3"
            id="personalInfo"
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
    </>
  );
}
