import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import PersonalInfoForm from "../../_components/forms/PersonalInfoForm";
import { PageWithBackButton } from "../../_components/PageWithBackButton";
import { HasPermission } from "@/components/HasPermission";
import { canCreateProfile } from "@/server/permissions";

export default async function CreateNewCVPage() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  return (
    <PageWithBackButton
      backButtonHref="/dashboard"
      pageTitle="Create CV Profile"
    >
      <HasPermission
        permission={canCreateProfile}
        renderFallback
        fallbackText="You have already created the maximum number of profiles. Try upgrading your account to create more."
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfoForm />
          </CardContent>
        </Card>
      </HasPermission>
    </PageWithBackButton>
  );
}
