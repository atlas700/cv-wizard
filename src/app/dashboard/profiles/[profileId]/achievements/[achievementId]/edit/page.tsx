import AchievementForm from "@/app/dashboard/_components/forms/AchievementForm";
import EducationForm from "@/app/dashboard/_components/forms/EducationForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfileAchievement } from "@/server/db/achievement";

export default async function EducationEditPage({
  params,
}: {
  params: Promise<{ profileId: string; achievementId: string }>;
}) {
  const profileId = (await params).profileId;
  const achievementId = (await params).achievementId;

  const profileEducation = await getProfileAchievement({
    profileId,
    id: achievementId,
  });

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=achievement`}
      pageTitle="Edit Achievement"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Achievement</CardTitle>
        </CardHeader>
        <CardContent>
          <AchievementForm
            profileAchievement={profileEducation}
            profileId={profileId}
          />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
