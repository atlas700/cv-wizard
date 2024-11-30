import EducationForm from "@/app/dashboard/_components/forms/EducationForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfileEducation } from "@/server/db/education";

export default async function EducationEditPage({
  params,
}: {
  params: Promise<{ profileId: string; educationId: string }>;
}) {
  const profileId = (await params).profileId;
  const educationId = (await params).educationId;

  const profileEducation = await getProfileEducation({
    profileId,
    id: educationId,
  });

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=education`}
      pageTitle="Edit Education"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Education</CardTitle>
        </CardHeader>
        <CardContent>
          <EducationForm
            profileEducation={profileEducation}
            profileId={profileId}
          />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
