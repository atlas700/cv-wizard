import { BrandLogo } from "@/components/BrandLogo";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { LogIn, User } from "lucide-react";
import Link from "next/link";

export function NavBar() {
  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link className="text-lg" href="/#pricing">
          Pricing
        </Link>
        <span className="text-lg">
          <SignedIn>
            <Link href="/dashboard">Dashboard</Link>
          </SignedIn>
          <SignedOut>
            <div>
              <SignInButton>Login</SignInButton>
            </div>
          </SignedOut>
        </span>
      </nav>
    </header>
  );
}
