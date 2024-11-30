import SkillForm from "@/app/dashboard/_components/forms/SkillForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfileSkills } from "@/server/db/skill";

export default async function SkillsEditPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profileId = (await params).profileId;

  const profileSkills = await getProfileSkills({
    profileId,
  });

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=skill`}
      pageTitle="Edit Skills"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillForm profileSkills={profileSkills} profileId={profileId} />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
