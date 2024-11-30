"use client";

import { ReactNode, useRef } from "react";
import { Button } from "@/components/ui/button";
import SimpleCV from "@/components/cvs/SimpleCV";
import { generatePDF } from "@/lib/pdfGenerator";

export default function CVCarouselItem({ children }: { children: ReactNode }) {
  const cvRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cvRef.current) {
      await generatePDF(cvRef.current);
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg">
        <div ref={cvRef}>{children}</div>
      </div>
      <div className="mt-8 flex justify-center">
        <Button onClick={handleDownload}>Download PDF</Button>
      </div>
    </div>
  );
}
