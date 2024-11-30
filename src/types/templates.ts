export interface Template {
  id: string;
  name: string;
  previewImage: string;
  description: string;
  category: "professional" | "creative" | "modern" | "simple";
  isPremium: boolean;
}
