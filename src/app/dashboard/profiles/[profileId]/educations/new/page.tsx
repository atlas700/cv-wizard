import EducationForm from "@/app/dashboard/_components/forms/EducationForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";

export default async function CreateNewEducationPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profileId = (await params).profileId;

  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=education`}
      pageTitle="Create New Education"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Education</CardTitle>
        </CardHeader>
        <CardContent>
          <EducationForm profileId={profileId} />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
