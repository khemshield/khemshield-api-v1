import z from "zod";
import { UserRole } from "./user.model";

// Helper to validate min length ONLY if non-empty
const optionalMinIfNotEmpty = (min: number, msg: string) =>
  z
    .string()
    .optional()
    .refine((val) => !val || val.length >= min, { message: msg });

export const UserSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(8, "Phone no should not be less than 8 characters"),
    street: optionalMinIfNotEmpty(10, "Street must be at least 10 characters"),
    state: optionalMinIfNotEmpty(2, "State must be at least 2 characters"),
    city: optionalMinIfNotEmpty(2, "City must be at least 2 characters"),
    postalCode: optionalMinIfNotEmpty(
      4,
      "Postal code must be at least 4 characters"
    ),
    roles: z
      .array(z.nativeEnum(UserRole))
      .max(2, "Roles can only be admin or instructor")
      .transform((roles) => (roles.length === 0 ? [UserRole.Student] : roles)),
  })
  .strict();
