import { Schema, model, Types, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  expiryDate?: Date;
  usageLimit?: number;
  usageCount?: number;
  isActive: boolean;
  course?: Types.ObjectId | null; // null = global
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    expiryDate: Date,
    usageLimit: Number,
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", default: null },
  },
  { timestamps: true }
);

const Coupon = model<ICoupon>("Coupon", couponSchema);
export default Coupon;
