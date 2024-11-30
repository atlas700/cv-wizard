import { LoaderIcon } from "lucide-react";

export default function DashboardLoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderIcon className="size-28 animate-spin" />
    </div>
  );
}