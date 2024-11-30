"use client";

import { AvatarIcon } from "@radix-ui/react-icons";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

type CVTemplateProps = {
  personalInfo: {
    firstName: string;
    lastName: string | null;
    avatarUrl: string | null;
    email: string | null;
    profession: string | null;
    bio: string | null;
    phoneNumber: string | null;
    address: string | null;
    portfolio: string | null;
  };
  educations: {
    id: string;
    location: string | null;
    profileId: string;
    institution: string;
    degree: string | null;
    startDate: string | null;
    endDate: string | null;
  }[];
  experiences: {
    id: string;
    location: string | null;
    description: string | null;
    profileId: string;
    startDate: string | null;
    endDate: string | null;
    jobTittle: string;
    company: string;
  }[];
  skills: {
    id: string;
    skillName: string;
    profileId: string;
  }[];
  projects: {
    link: string | null;
    id: string;
    title: string;
    description: string | null;
    profileId: string;
    duration: string | null;
  }[];
  awards: {
    id: string;
    title: string;
    date: string | null;
    description: string | null;
    profileId: string;
  }[];
};

export function GlassmorphicCVTemplate({
  personalInfo,
  educations,
  experiences,
  skills,
  projects,
  awards,
}: CVTemplateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!cvRef.current) return;

    setIsGenerating(true);

    try {
      // Create a clone of the CV element
      const cvClone = cvRef.current.cloneNode(true) as HTMLElement;

      // Apply absolute positioning to maintain layout
      cvClone.style.position = "absolute";
      cvClone.style.left = "-9999px";
      cvClone.style.top = "-9999px";
      document.body.appendChild(cvClone);

      // Wait for images to load
      const images = cvClone.getElementsByTagName("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve(null);
              img.onload = () => resolve(null);
              img.onerror = () => resolve(null);
            })
        )
      );

      const canvas = await html2canvas(cvClone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 793, // A4 width in pixels at 96 DPI
        height: 1122, // A4 height in pixels at 96 DPI
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Apply custom styles to the cloned document
          const styleSheet = document.createElement("style");
          styleSheet.textContent = `
            * { 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .bg-indigo-50\/30 { background-color: rgba(238, 242, 255, 0.3) !important; }
            .border-gray-200 { border-color: rgb(249, 168, 212) !important; }
            .bg-purple-100 { background-color: rgb(243, 232, 255) !important; }
            .text-purple-800 { color: rgb(107, 33, 168) !important; }
          `;
          clonedDoc.head.appendChild(styleSheet);
        },
      });

      // Clean up the clone
      document.body.removeChild(cvClone);

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      pdf.save(`${personalInfo.firstName}-cv.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-2 flex flex-col items-center gap-4">
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className=" transition-all duration-300"
      >
        {isGenerating ? "Generating PDF..." : "Download PDF"}
      </Button>

      <div className="w-full max-w-full overflow-x-auto pb-4">
        <div
          ref={cvRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            background: "linear-gradient(135deg, #f6f8ff 0%, #f1f5ff 100%)",
          }}
          className="mx-auto font-sans relative"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/20 blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-3xl" />
          </div>

          <div className="relative p-12 z-10">
            {/* Header Section */}
            <header className="mb-12">
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/30 border border-white/30 shadow-lg">
                  {personalInfo.avatarUrl ? (
                    <img
                      src={personalInfo.avatarUrl}
                      alt={personalInfo.firstName}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                      <AvatarIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {personalInfo.profession}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {personalInfo.email && (
                      <span className="flex items-center gap-2">
                        📧 {personalInfo.email}
                      </span>
                    )}
                    {personalInfo.phoneNumber && (
                      <span className="flex items-center gap-2">
                        📱 {personalInfo.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="col-span-2 space-y-8">
                {personalInfo.bio && (
                  <section className="glassmorphic-card">
                    <h2 className="section-title">About Me</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {personalInfo.bio}
                    </p>
                  </section>
                )}

                {experiences.length > 0 && (
                  <section className="glassmorphic-card">
                    <h2 className="section-title">Experience</h2>
                    <div className="space-y-6">
                      {experiences.map((experience) => (
                        <div
                          key={experience.id}
                          className="relative pl-6 border-l-2 border-purple-200"
                        >
                          <div className="absolute w-3 h-3 bg-purple-300 rounded-full left-[-7px] top-2" />
                          <h3 className="text-lg font-semibold text-gray-800">
                            {experience.jobTittle}
                          </h3>
                          <p className="text-purple-600 font-medium text-sm">
                            {experience.company}
                          </p>
                          <p className="text-sm text-gray-500">
                            {experience.startDate} - {experience.endDate}
                          </p>
                          {experience.description && (
                            <p className="mt-2 text-gray-600 text-sm">
                              {experience.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {projects.length > 0 && (
                  <section className="glassmorphic-card">
                    <h2 className="section-title">Featured Projects</h2>
                    <div className="grid gap-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30"
                        >
                          <h3 className="text-lg font-semibold text-gray-800">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {project.description}
                            </p>
                          )}
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 text-sm hover:underline mt-2 inline-block"
                            >
                              {project.link}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {skills.length > 0 && (
                  <section className="glassmorphic-card">
                    <h2 className="section-title">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-white/40 backdrop-blur-sm border border-white/30 text-gray-700"
                        >
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {educations.length > 0 && (
                  <section className="glassmorphic-card">
                    <h2 className="section-title">Education</h2>
                    <div className="space-y-4">
                      {educations.map((education) => (
                        <div key={education.id}>
                          <h3 className="font-semibold text-gray-800">
                            {education.degree}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {education.institution}
                          </p>
                          <p className="text-sm text-gray-500">
                            {education.startDate} - {education.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {awards.length > 0 && (
                  <section className="glassmorphic-card">
                    <h2 className="section-title">Awards</h2>
                    <ul className="space-y-2">
                      {awards.map((award) => (
                        <li key={award.id} className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            {award.title}
                          </span>
                          {award.date && (
                            <span className="text-gray-500">
                              {" "}
                              • {award.date}
                            </span>
                          )}
                          {award.description && (
                            <p className="text-gray-600 mt-1">
                              {award.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
