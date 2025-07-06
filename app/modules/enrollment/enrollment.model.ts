import { Schema, model, Types } from "mongoose";

export enum EnrollmentStatus {
  Active = "active",
  Completed = "completed",
  Dropped = "dropped",
}

export enum PaymentProgressStatus {
  Pending = "pending", // No payment yet
  Partial = "partial", // Some payment done
  Completed = "completed", // Fully paid
}

export enum DeliveryMethod {
  Virtual = "virtual",
  InPerson = "in-person",
  Hybrid = "hybrid",
}

export enum EItemType {
  Course = "Course",
  // Certificate = "Certificate",
  // Mentorship = "Mentorship",
  // Event = "Event",
}

export interface IEnrollment {
  user: Types.ObjectId; // Can be student, instructor, etc.
  itemType: EItemType;
  itemRef: Types.ObjectId;
  enrolledAt?: Date;
  status?: EnrollmentStatus;
  deliveryMode?: DeliveryMethod;
  sourcePayment?: Types.ObjectId;
  metadata?: Record<string, any>;

  course: Types.ObjectId;

  // Payment tracking
  paymentProgressStatus: PaymentProgressStatus; // Progress in payment
  isFullyPaid: boolean;
  amountPaid: number;
  balance: number;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemType: { type: String, enum: Object.values(EItemType), required: true },
    itemRef: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "itemType", // 👈 this tells Mongoose to use itemType to determine the model
    },
    enrolledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(EnrollmentStatus),
      default: EnrollmentStatus.Active,
    },
    deliveryMode: {
      type: String,
      enum: Object.values(DeliveryMethod), // <-- ADD THIS
      default: DeliveryMethod.InPerson,
    },
    sourcePayment: { type: Schema.Types.ObjectId, ref: "Payment" },
    metadata: { type: Schema.Types.Mixed },

    // Payment progress
    paymentProgressStatus: {
      type: String,
      enum: Object.values(PaymentProgressStatus),
      default: PaymentProgressStatus.Pending,
    },
    isFullyPaid: { type: Boolean, default: false },
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, itemType: 1, itemRef: 1 }, { unique: true });

export default model<IEnrollment>("Enrollment", enrollmentSchema);
