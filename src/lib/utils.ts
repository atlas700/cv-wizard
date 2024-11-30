import { clsx, type ClassValue } from "clsx";
import { jsPDF } from "jspdf";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompactNumber(
  num: number,
  locale: string = "en-US"
): string {
  // Check if the number is a valid number
  if (isNaN(num)) {
    throw new Error("Input must be a valid number.");
  }

  // Create a formatter for compact numbers
  const formatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(num);
}
