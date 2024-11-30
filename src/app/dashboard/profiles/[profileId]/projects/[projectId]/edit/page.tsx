import ProjectForm from "@/app/dashboard/_components/forms/ProjectForm";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfileProject } from "@/server/db/project";

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ profileId: string; projectId: string }>;
}) {
  const profileId = (await params).profileId;
  const projectId = (await params).projectId;

  const profileProject = await getProfileProject({
    profileId,
    id: projectId,
  });

  return (
    <PageWithBackButton
      backButtonHref={`/dashboard/profiles/${profileId}/edit?tab=project`}
      pageTitle="Edit Project"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm profileProject={profileProject} profileId={profileId} />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
