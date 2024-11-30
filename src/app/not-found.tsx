import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center flex-col gap-5 h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription className="max-w-sm">
            Could not find requested resource, please redirect back to the home
            page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
