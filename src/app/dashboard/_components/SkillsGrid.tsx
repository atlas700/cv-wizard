import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function SkillsGrid({
  userProfileSkills,
}: {
  userProfileSkills: {
    id: string;
    profileId: string;
    skillName: string;
  }[];
}) {
  return (
    <div className="flex gap-6">
      {userProfileSkills.map((profile) => (
        <SkillCard key={profile.id} {...profile} />
      ))}
    </div>
  );
}

export function SkillCard({
  id,
  profileId,
  skillName,
}: {
  id: string;
  profileId: string;
  skillName: string;
}) {
  return (
    <Card className="size-fit p-0 flex items-center justify-center h-10 rounded-full hover:bg-accent/5 transition-[background-color]">
      <CardHeader>
        <CardTitle className="p-0">
          <Link href={`/dashboard/profiles/${profileId}/skills/edit`}>
            {skillName}
          </Link>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
