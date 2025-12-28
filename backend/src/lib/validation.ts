import { z } from "zod";

export const SignUpSchema = z.object({
  firstName: z.string().min(1, "Firstname is required"),
  lastName: z.string().optional(),
  email: z
    .email("Please provide a valid email address.")
    .min(1, "Email is required."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .max(100, "Password cannot exceed 100 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character."
    ),
});

export const SignInSchema = z.object({
  email: z
    .email("Please provide a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .max(100, "Password cannot exceed 100 characters."),
});

export const PaginatedSearchSchema = z.object({
  page: z.number().min(1, "Page number is required").default(1),
  pageSize: z.number().min(1, "Page size is required").default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
});

export const GetLocationSchema = z.object({
  locationId: z.string().min(1, "Location id is required"),
});

export const CreateBookingSchema = z.object({
  locationId: z.string().min(1, "Location id is required"),
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

export const DeleteBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking id is required"),
});

export const GetAvailabilitySchema = z.object({
  locationId: z.string().cuid(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export const GetUserBookingsSchema = PaginatedSearchSchema.extend({
  userId: z.string().min(1, "User id is required"),
});
