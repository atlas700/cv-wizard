import Chat from "@/app/dashboard/_components/chat";
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { HasPermission } from "@/components/HasPermission";
import { canCreateProfile } from "@/server/permissions";

export default async function CreateNewAICVPage() {
  return (
    <HasPermission
      permission={canCreateProfile}
      renderFallback
      fallbackText="You have already created the maximum number of profiles. Try upgrading your account to create more."
    >
      <Chat />
    </HasPermission>
  );
}
