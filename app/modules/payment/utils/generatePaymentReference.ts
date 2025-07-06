import { customAlphabet } from "nanoid";
import { PaymentMethod } from "../payment.model";

const nanoid = customAlphabet("1234567890abcdef", 10);

export function generatePaymentReference(source: PaymentMethod) {
  const prefix = source.toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}_${timestamp}_${nanoid()}`;
}

// Example output: PAYSTACK_812901_ab12cf98
