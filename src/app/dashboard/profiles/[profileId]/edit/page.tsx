import { AchievementsGrid } from "@/app/dashboard/_components/AchievementsGrid";
import { EducationGrid } from "@/app/dashboard/_components/EducationGrid";
import { ExperienceGrid } from "@/app/dashboard/_components/ExperienceGrid";
import PersonalInfoForm from "@/app/dashboard/_components/forms/PersonalInfoForm";
import { NoProfileAchievements } from "@/app/dashboard/_components/NoProfileAchievements";
import { NoProfileEducations } from "@/app/dashboard/_components/NoProfileEducations";
import { NoProfileExperiences } from "@/app/dashboard/_components/NoProfileExperiences";
import { NoProfileProjects } from "@/app/dashboard/_components/NoProfileProjects";
import { NoProfileSkills } from "@/app/dashboard/_components/NoProfileSkills";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { ProjectsGrid } from "@/app/dashboard/_components/ProjectsGrid";
import { SkillsGrid } from "@/app/dashboard/_components/SkillsGrid";
import { CVTemplate } from "@/components/cvs/CVTemplate";
import { GlassmorphicCVTemplate } from "@/components/cvs/GlassMorphicCV";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfileAchievements } from "@/server/db/achievement";
import { getProfileEducations } from "@/server/db/education";
import { getProfileExperiences } from "@/server/db/experience";
import { getProfile } from "@/server/db/profiles";
import { getProfileProjects } from "@/server/db/project";
import { getProfileSkills } from "@/server/db/skill";
import { auth } from "@clerk/nextjs/server";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProfileEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ profileId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const profileId = (await params).profileId;
  const tab = (await searchParams).tab;

  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const userProfile = await getProfile({ userId, id: profileId });

  if (userProfile == null) return notFound();

  const userEducation = await getProfileEducations({ profileId });
  const userExperience = await getProfileExperiences({ profileId });
  const userSkills = await getProfileSkills({ profileId });
  const userProjects = await getProfileProjects({ profileId });
  const userAchievements = await getProfileAchievements({ profileId });

  return (
    <PageWithBackButton
      backButtonHref="/dashboard/profiles"
      pageTitle="Edit Profile"
    >
      <div className="flex flex-col gap-6 sm:gap-8">
        <Tabs defaultValue={tab ?? "personalInfo"}>
          <TabsList className="bg-background/60 w-max inline-flex">
            <TabsTrigger value="personalInfo">Personal Information</TabsTrigger>
            <TabsTrigger value="education">Educations</TabsTrigger>
            <TabsTrigger value="experience">Experiences</TabsTrigger>
            <TabsTrigger value="skill">Skills</TabsTrigger>
            <TabsTrigger value="project">Projects</TabsTrigger>
            <TabsTrigger value="achievement">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="personalInfo">
            <PersonalInfoTab userProfile={userProfile} />
          </TabsContent>
          <TabsContent value="education">
            <EducationTab profileId={profileId} />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceTab profileId={userProfile.id} />
          </TabsContent>
          <TabsContent value="skill">
            <SkillTab profileId={userProfile.id} />
          </TabsContent>
          <TabsContent value="project">
            <ProjectTab profileId={userProfile.id} />
          </TabsContent>
          <TabsContent value="achievement">
            <AchievementTab profileId={userProfile.id} />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-6 mt-4">
          <h2 className="text-2xl font-semibold text-center">Preview CV</h2>

          <Carousel className="max-w-screen-lg mx-auto bg-gray-100">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent>
                      <CVTemplate
                        personalInfo={{
                          firstName: userProfile.firstName,
                          lastName: userProfile.lastName,
                          address: userProfile.location,
                          avatarUrl: userProfile.profileImage,
                          bio: userProfile.bio,
                          email: userProfile.email,
                          phoneNumber: userProfile.phoneNumber,
                          portfolio: userProfile.portfolio,
                          profession: userProfile.profession,
                        }}
                        educations={userEducation}
                        experiences={userExperience}
                        skills={userSkills}
                        projects={userProjects}
                        awards={userAchievements}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent>
                      <GlassmorphicCVTemplate
                        personalInfo={{
                          firstName: userProfile.firstName,
                          lastName: userProfile.lastName,
                          address: userProfile.location,
                          avatarUrl: userProfile.profileImage,
                          bio: userProfile.bio,
                          email: userProfile.email,
                          phoneNumber: userProfile.phoneNumber,
                          portfolio: userProfile.portfolio,
                          profession: userProfile.profession,
                        }}
                        educations={userEducation}
                        experiences={userExperience}
                        skills={userSkills}
                        projects={userProjects}
                        awards={userAchievements}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious variant={"accent"} />
            <CarouselNext variant={"accent"} />
          </Carousel>
        </div>
      </div>
    </PageWithBackButton>
  );
}

function PersonalInfoTab({
  userProfile,
}: {
  userProfile: {
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <PersonalInfoForm userProfile={userProfile} />
      </CardContent>
    </Card>
  );
}

async function ExperienceTab({ profileId }: { profileId: string }) {
  const profileExperiences = await getProfileExperiences({ profileId });

  if (profileExperiences.length == 0) {
    return <NoProfileExperiences profileId={profileId} />;
  }

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold flex justify-between">
        <span className=" flex gap-2 items-center">Experiences</span>
        <Button asChild size={"sm"}>
          <Link href={`/dashboard/profiles/${profileId}/experiences/new`}>
            <PlusIcon className="size-4 mr-2" />
            New Experience
          </Link>
        </Button>
      </h2>

      <ExperienceGrid userProfileExperience={profileExperiences} />
    </>
  );
}

async function EducationTab({ profileId }: { profileId: string }) {
  const profileEducations = await getProfileEducations({ profileId });

  if (profileEducations.length == 0) {
    return <NoProfileEducations profileId={profileId} />;
  }

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold flex justify-between">
        <span className=" flex gap-2 items-center">Educations</span>
        <Button asChild size={"sm"}>
          <Link href={`/dashboard/profiles/${profileId}/educations/new`}>
            <PlusIcon className="size-4 mr-2" />
            New Education
          </Link>
        </Button>
      </h2>

      <EducationGrid userProfileEducation={profileEducations} />
    </>
  );
}

async function SkillTab({ profileId }: { profileId: string }) {
  const profileSkills = await getProfileSkills({ profileId });

  if (profileSkills.length == 0) {
    return <NoProfileSkills profileId={profileId} />;
  }

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold flex justify-between">
        <span className=" flex gap-2 items-center">Skills</span>
        <Button asChild size={"sm"}>
          <Link href={`/dashboard/profiles/${profileId}/skills/new`}>
            <PlusIcon className="size-4 mr-2" />
            New Skill
          </Link>
        </Button>
      </h2>

      <SkillsGrid userProfileSkills={profileSkills} />
    </>
  );
}

async function ProjectTab({ profileId }: { profileId: string }) {
  const profileProjects = await getProfileProjects({ profileId });

  if (profileProjects.length == 0) {
    return <NoProfileProjects profileId={profileId} />;
  }

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold flex justify-between">
        <span className=" flex gap-2 items-center">Projects</span>
        <Button asChild size={"sm"}>
          <Link href={`/dashboard/profiles/${profileId}/projects/new`}>
            <PlusIcon className="size-4 mr-2" />
            New Project
          </Link>
        </Button>
      </h2>

      <ProjectsGrid userProfileProject={profileProjects} />
    </>
  );
}

async function AchievementTab({ profileId }: { profileId: string }) {
  const profileAchievements = await getProfileAchievements({ profileId });

  if (profileAchievements.length == 0) {
    return <NoProfileAchievements profileId={profileId} />;
  }

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold flex justify-between">
        <span className=" flex gap-2 items-center">Achievements</span>
        <Button asChild size={"sm"}>
          <Link href={`/dashboard/profiles/${profileId}/achievements/new`}>
            <PlusIcon className="size-4 mr-2" />
            New Achievements
          </Link>
        </Button>
      </h2>

      <AchievementsGrid userProfileAchievements={profileAchievements} />
    </>
  );
}
