import { z } from "zod";

export const CreateBookingSchema = z.object({
  numOfPeople: z
    .number()
    .min(1, "At least 1 person is required")
    .max(50, "Maximum 50 people per booking"),
  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  totalPrice: z.number().min(0, "Price cannot be negative"),
  remarks: z.string().max(200, "Remarks too long").optional(),
});
