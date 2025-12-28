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
});

export const GetLocationSchema = z.object({
  locationId: z.string().min(1, "Location id is required"),
});
