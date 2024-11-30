import ProjectForm from "@/app/dashboard/_components/forms/ProjectForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";

export default async function CreateNewProjectPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profileId = (await params).profileId;

  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=project`}
      pageTitle="Create New Project"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm profileId={profileId} />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
