import { z } from "zod";

// Schema for registration request body
export const registerUserSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(), // Optional for admin-initiated
    //   photo: z.string().url().optional(),
    phone: z.string().optional(), // Required only if student
  })
  .strict();

// Inferred TypeScript type (optional)
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
