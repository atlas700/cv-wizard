import { Template } from "@/types/templates";

export const templates: Template[] = [
  {
    id: "template1",
    name: "Professional Classic",
    previewImage: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="565" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="565" fill="#fff"/>
        <rect width="130" height="565" fill="#f0f0f0"/>
        <rect x="140" y="20" width="240" height="60" fill="#333"/>
        <rect x="140" y="100" width="240" height="20" fill="#666"/>
        <rect x="140" y="130" width="240" height="400" fill="#e0e0e0"/>
        <rect x="20" y="20" width="90" height="90" rx="45" fill="#666"/>
        <rect x="20" y="130" width="90" height="10" fill="#666"/>
        <rect x="20" y="150" width="90" height="380" fill="#d0d0d0"/>
      </svg>
    `)}`,
    description: "Clean and professional design with a sidebar layout",
    category: "professional",
    isPremium: false,
  },
];
