import { BookCopy } from "lucide-react";
import Image from "next/image";

export function BrandLogo() {
  return (
    <span className="flex items-center gap-2 font-semibold flex-shrink-0 text-lg">
      <div className="rounded-full size-8 relative">
        <Image fill src={"/logo.jpeg"} alt="logo" className="rounded-full" />
      </div>
      <span>CV Wizard</span>
    </span>
  );
}
