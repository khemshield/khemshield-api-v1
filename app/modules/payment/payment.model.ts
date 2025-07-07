import { Schema, model, Types, Document } from "mongoose";

export enum EPaymentItem {
  Course = "course",
  Event = "event",
  Certificate = "certificate",
}

export enum PaymentMethod {
  Paystack = "paystack",
  Flutterwave = "flutterwave",
  Manual = "manual",
  Custom = "custom", // for other future gateways
}

export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
  Refunded = "refunded",
}

interface PaymentItem {
  itemType: EPaymentItem; // can add more later
  itemRef: Types.ObjectId;
  name: string; // snapshot name
  originalPrice: number;
  discountPercentage?: number;
  finalPrice: number;
  amountPaid: number;
}

export interface IPayment extends Document {
  user: Types.ObjectId;
  items: PaymentItem[];
  currency: string;
  totalAmount: number; // expected (due) amount
  amountPaid: number; // actual amount paid by user
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  reference: string;
  paidAt?: Date;
  metadata?: Record<string, any>;
  couponCode?: string;
  isVerified: boolean;
  recordedBy?: Types.ObjectId; // for manual/admin entries

  // PART PAYMENT TRACKING
  isPartPayment: boolean;
  partPaymentGroupId?: string;
  balanceAfterThisPayment?: number;
}

const paymentItemSchema = new Schema<PaymentItem>({
  itemType: { type: String, required: true },
  itemRef: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "itemType", // this tells Mongoose to use itemType to determine the model
  },
  name: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountPercentage: { type: Number },
  finalPrice: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
});

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [paymentItemSchema],
    currency: { type: String, required: true, default: "NGN" },

    /**
     * Represents the expected total to be paid.
     * This is the sum of all item final prices (after discount).
     * This is NOT the actual amount the user paid in this transaction.
     */
    totalAmount: { type: Number, required: true },
    /**
     * Represents the actual amount the user paid in this transaction.
     * This is used to distribute payment among enrollments.
     */
    amountPaid: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    reference: { type: String, required: true, unique: true },
    paidAt: { type: Date },
    couponCode: { type: String },
    metadata: { type: Schema.Types.Mixed }, // flexible
    isVerified: { type: Boolean, default: false },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" }, // only for manual
  },
  { timestamps: true }
);

// Helpful indexes
// paymentSchema.index({ reference: 1 }, { unique: true });
// paymentSchema.index({ user: 1, createdAt: -1 });

const Payment = model<IPayment>("Payment", paymentSchema);
export default Payment;
