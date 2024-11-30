import AchievementForm from "@/app/dashboard/_components/forms/AchievementForm";
import EducationForm from "@/app/dashboard/_components/forms/EducationForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";

export default async function CreateNewAchievementPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profileId = (await params).profileId;

  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=achievement`}
      pageTitle="Create New Achievement"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Achievement</CardTitle>
        </CardHeader>
        <CardContent>
          <AchievementForm profileId={profileId} />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
