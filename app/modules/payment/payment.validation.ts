import { z } from "zod";
import { DeliveryMethod, EItemType } from "../enrollment/enrollment.model";

export const PaymentItemSchema = z.object({
  itemType: z.nativeEnum(EItemType),
  itemId: z.string().optional(),
  predefinedId: z.string().optional(),
});

export const CreatePaymentSchema = z
  .object({
    user: z.string().min(1),
    items: z.array(PaymentItemSchema).min(1),
    currency: z.string().default("NGN"),
    amountPaid: z.number(),
    deliveryMode: z.nativeEnum(DeliveryMethod).optional(),
    couponCode: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  })
  .strict();

export type CreatePaymentType = z.infer<typeof PaymentItemSchema>;
export type PaymentItemType = z.infer<typeof PaymentItemSchema>;
