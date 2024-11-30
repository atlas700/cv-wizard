import SkillForm from "@/app/dashboard/_components/forms/SkillForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfileSkills } from "@/server/db/skill";
import { auth } from "@clerk/nextjs/server";

export default async function CreateNewSkillPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profileId = (await params).profileId;

  const { userId, redirectToSignIn } = await auth();

  const userSkills = await getProfileSkills({ profileId });

  if (userId == null) return redirectToSignIn();

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=skill`}
      pageTitle="Create New Skill"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillForm profileId={profileId} profileSkills={userSkills} />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
