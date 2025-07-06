import { z } from "zod";

export const CreateCouponSchema = z
  .object({
    code: z.string().min(3),
    discountPercentage: z.number().min(1).max(100),
    expiryDate: z.coerce.date().optional(), // coerce string to Date
    usageLimit: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
    course: z.string().optional().nullable(), // allow global coupons
  })
  .strict();

export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
