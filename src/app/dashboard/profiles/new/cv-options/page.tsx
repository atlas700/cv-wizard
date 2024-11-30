import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Bot, UserCircle } from "lucide-react";
import Link from "next/link";

export default async function CVSelectorPage() {
  return (
    <div className="min-h-screen  flex  justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Choose Your Creative Experience
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <OptionCard
            title="Custom"
            description="Add personal information, educations, experiences, skills, awards and projects to add in the cv."
            icon={<UserCircle className="w-12 h-12 text-accent/70" />}
            link={`/dashboard/profiles/new`}
          />
          <OptionCard
            title="AI-Powered Generation"
            description="Let our advanced AI guide you through an optimized and creative experience of cv generation."
            icon={<Bot className="w-12 h-12 text-accent/70" />}
            link={`/dashboard/profiles/new/ai`}
          />
        </div>
      </div>
    </div>
  );
}

interface OptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

function OptionCard({ title, description, icon, link }: OptionCardProps) {
  return (
    <Card className="backdrop-blur-lg border-white/20  hover:/20 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-500">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={link} passHref>
          <Button className="w-full">
            Choose
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
