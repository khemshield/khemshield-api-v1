import { Schema, model, Types, Document } from "mongoose";
import { EItemType } from "../enrollment/enrollment.model";

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  expiryDate?: Date;
  usageLimit?: number;
  usageCount?: number;
  isActive: boolean;
  applicableItemType?: EItemType | null;
  applicableItemId?: Types.ObjectId | null;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    expiryDate: Date,
    usageLimit: Number,
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    applicableItemType: {
      type: String,
      enum: Object.values(EItemType),
      default: null,
    },
    applicableItemId: {
      type: Schema.Types.ObjectId,
      refPath: "applicableItemType", // polymorphic
      default: null,
    },
  },
  { timestamps: true }
);
const Coupon = model<ICoupon>("Coupon", couponSchema);
export default Coupon;
