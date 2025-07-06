import { Types } from "mongoose";
import { AppError } from "../../utils/errors";
import Coupon from "./coupon.model";
import { checkCouponValidity } from "./utils/checkCouponValidity";

/**
 * Validates a coupon code
 * Returns the discount percentage if valid, otherwise throws an error or returns 0.
 */
export const validateCoupon = async (
  couponCode: string,
  courseId: Types.ObjectId
): Promise<number> => {
  const coupon = await checkCouponValidity(couponCode, courseId);

  // ✅ Only validateCoupon increases usage
  coupon.usageCount = (coupon.usageCount || 0) + 1;
  await coupon.save();

  return coupon.discountPercentage || 0;
};

export const validateCouponOrSkip = async (
  couponCode: string,
  courseId: Types.ObjectId
): Promise<number> => {
  try {
    return await validateCoupon(couponCode, courseId);
  } catch (err) {
    console.warn("Invalid coupon skipped:", (err as Error).message);
    return 0;
  }
};

export const verifyCoupon = async (
  couponCode: string,
  courseId: Types.ObjectId
): Promise<number> => {
  const coupon = await checkCouponValidity(couponCode, courseId);
  return coupon.discountPercentage || 0;
};

export const createCoupon = async ({
  code,
  discountPercentage,
  expiryDate,
  usageLimit,
  isActive = true,
  course = null,
}: {
  code: string;
  discountPercentage: number;
  expiryDate?: Date;
  usageLimit?: number;
  isActive?: boolean;
  course?: Types.ObjectId | null;
}) => {
  const existing = await Coupon.findOne({ code });
  if (existing) throw new AppError("Coupon code already exists");

  const newCoupon = await Coupon.create({
    code,
    discountPercentage,
    expiryDate,
    usageLimit,
    isActive,
    course: course ? course : null,
  });

  return newCoupon;
};

export const getCouponById = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw new AppError("Coupon not found");
  return coupon;
};

export const getAllCoupons = async (filters?: {
  course?: string;
  activeOnly?: boolean;
}) => {
  const query: any = {};
  if (filters?.course) query.course = filters.course;
  if (filters?.activeOnly) {
    query.isActive = true;
    query.expiryDate = { $gt: new Date() };
  }

  return await Coupon.find(query).sort({ createdAt: -1 });
};

export const updateCoupon = async (
  couponId: string,
  update: Partial<{
    code: string;
    discountPercentage: number;
    expiryDate: Date;
    usageLimit: number;
    isActive: boolean;
  }>
) => {
  const coupon = await Coupon.findByIdAndUpdate(couponId, update, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new AppError("Coupon not found");
  return coupon;
};

export const deleteCoupon = async (couponId: string) => {
  const deleted = await Coupon.findByIdAndDelete(couponId);
  if (!deleted) throw new AppError("Coupon not found");
  return deleted;
};
