import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import PersonalInfoForm from "@/app/dashboard/_components/forms/PersonalInfoForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import ExperienceForm from "@/app/dashboard/_components/forms/ExperienceForm";

export default async function CreateNewExperiencePage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profileId = (await params).profileId;

  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=experience`}
      pageTitle="Create New Experience"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceForm profileId={profileId} />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
