import ExperienceForm from "@/app/dashboard/_components/forms/ExperienceForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfileExperience } from "@/server/db/experience";

export default async function ExperienceEditPage({
  params,
}: {
  params: Promise<{ profileId: string; experienceId: string }>;
}) {
  const profileId = (await params).profileId;
  const experienceId = (await params).experienceId;

  const profileExperience = await getProfileExperience({
    profileId,
    id: experienceId,
  });

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=experience`}
      pageTitle="Edit Experience"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceForm
            profileExperience={profileExperience}
            profileId={profileId}
          />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
