import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBookingDate = (date: Date | string) => {
  if (!date) return "N/A";

  const d = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(d)) return "Invalid Date";

  return format(d, "d MMM yyyy");
};
