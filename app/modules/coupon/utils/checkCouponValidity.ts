import { Types } from "mongoose";
import Coupon from "../coupon.model";
import { AppError } from "../../../utils/errors";

export const checkCouponValidity = async (
  couponCode: string,
  courseId: Types.ObjectId
) => {
  const coupon = await Coupon.findOne({
    code: couponCode,
    isActive: true,
    $or: [
      { course: courseId },
      { course: null }, // global coupon
    ],
  });

  if (!coupon) throw new AppError("Invalid or expired coupon");

  const now = new Date();

  if (coupon.expiryDate && coupon.expiryDate < now) {
    throw new AppError("Coupon has expired");
  }

  if (
    coupon.usageLimit &&
    coupon.usageCount &&
    coupon.usageCount >= coupon.usageLimit
  ) {
    throw new AppError("Coupon usage limit reached");
  }

  return coupon;
};
