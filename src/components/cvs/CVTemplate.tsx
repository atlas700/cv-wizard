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

export function CVTemplate({
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
        className=" transition-colors duration-300"
      >
        {isGenerating ? "Generating PDF..." : "Download PDF"}
      </Button>

      <div className="w-full max-w-full overflow-x-auto pb-4 ">
        <div
          ref={cvRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            maxWidth: "210mm",
            margin: "0 auto",
            // backgroundColor: "white",
          }}
          className="font-sans shadow-lg bg-background"

          // className="bg-indigo-50/30  mx-auto font-sans"
        >
          <div className="p-12">
            <header className="text-center mb-8 flex gap-x-9 items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-gray-200 shadow-lg">
                {personalInfo.avatarUrl ? (
                  <img
                    src={personalInfo.avatarUrl}
                    alt={personalInfo.firstName.slice(0, 2)}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                ) : (
                  <AvatarIcon className="w-full h-full" />
                )}
              </div>
              <div className="flex flex-col text-start">
                <h1 className="text-4xl font-bold bg-clip-text bg-gradient-to-r text-gray-800">
                  {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                <p className="text-xl text-gray-700 mt-2">
                  {personalInfo.profession}
                </p>
              </div>
            </header>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                {personalInfo.bio ? (
                  <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Professional Summary
                    </h2>
                    <div className="h-[2px] w-full bg-gray-200 my-2" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {personalInfo.bio}
                    </p>
                  </section>
                ) : null}

                {experiences.length > 0 ? (
                  <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 ">
                      Experience
                    </h2>
                    <div className="h-[2px] w-full bg-gray-200 my-2" />
                    {experiences.map((experience) => (
                      <div className="mb-4" key={experience.id}>
                        <h3 className="text-lg font-semibold text-gray-700">
                          {experience.jobTittle}
                        </h3>
                        <p className="text-sm text-purple-600 font-medium">
                          {experience.company} & {experience.startDate} -{" "}
                          {experience.endDate}
                        </p>
                        <p className="text-sm text-gray-700 mt-1 space-y-1">
                          {experience.description}
                        </p>
                      </div>
                    ))}
                  </section>
                ) : null}

                {educations.length > 0 ? (
                  <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Education
                    </h2>
                    <div className="h-[2px] w-full bg-gray-200 my-2" />

                    {educations.map((education) => (
                      <div key={education.id}>
                        <p className="text-base text-gray-700 font-semibold">
                          {education.degree} {education.institution}
                        </p>
                        <p className="text-sm text-gray-600">
                          {education.institution}, {education.startDate} -{" "}
                          {education.endDate}
                        </p>
                      </div>
                    ))}
                  </section>
                ) : null}

                {projects.length > 0 ? (
                  <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Featured Project
                    </h2>
                    <div className="h-[2px] w-full bg-gray-200 my-2 mt-4" />
                    {projects.map((project, index) => (
                      <div className="flex gap-2" key={project.id}>
                        <span className="text-lg font-semibold">
                          {index + 1}
                        </span>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-lg font-semibold text-gray-700">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-gray-500 text-sm">
                              {project.description}
                            </p>
                          )}
                          {project.link && (
                            <div className="text sm text-gray-700 flex justify-between">
                              <span className="font-medium">URL</span>
                              <span className="text-blue-500">
                                {project.link}
                              </span>
                            </div>
                          )}
                          {project.duration && (
                            <div className="text sm text-gray-700 flex justify-between">
                              <span className="font-medium">Duration</span>
                              <span>{project.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </section>
                ) : null}
              </div>

              <div>
                {personalInfo != null ? (
                  <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Contact
                    </h2>
                    <div className="h-[2px] w-full bg-gray-200 my-2 mt-4" />
                    <p className="text-sm text-gray-700">
                      Email: {personalInfo.email}
                    </p>
                    <p className="text-sm text-gray-700">
                      Phone: {personalInfo.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-700">
                      Portfolio: {personalInfo.portfolio}
                    </p>
                    <p className="text-sm text-gray-700">
                      Location: {personalInfo.address}
                    </p>
                  </section>
                ) : null}

                {skills.length > 0 ? (
                  <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Skills
                    </h2>
                    <div className="h-[2px] w-full bg-gray-200 my-2 mt-4" />

                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="bg-background text-purple-800 text-xs font-medium px-2 py-0.5"
                        >
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}

                {awards.length > 0 ? (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Awards
                    </h2>
                    <div className="h-[2px] w-full bg-gray-200 my-2 mt-4" />
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {awards.map((award) => (
                        // <li>Webby Award for Best Visual Design, 2022</li>

                        <li key={award.id}>
                          {" "}
                          {award.title},{" "}
                          {award.description && award.description},{" "}
                          {award.date && award.date}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
