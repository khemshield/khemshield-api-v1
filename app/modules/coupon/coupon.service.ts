import { Types } from "mongoose";
import { AppError } from "../../utils/errors";
import { EItemType } from "../enrollment/enrollment.model";
import Coupon from "./coupon.model";

/**
 * Verifies if a coupon is valid for a set of items (without increasing usage count).
 */
export const verifyCoupon = async (
  couponCode: string,
  items: { itemType: EItemType; itemId: Types.ObjectId }[]
): Promise<number> => {
  const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
  if (!coupon) throw new AppError("Coupon not found or inactive");

  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    throw new AppError("Coupon has expired");
  }

  if (coupon.usageLimit && (coupon.usageCount ?? 0) >= coupon.usageLimit) {
    throw new AppError("Coupon usage limit exceeded");
  }

  // ✅ Global coupon
  if (!coupon.applicableItemType && !coupon.applicableItemId)
    return coupon.discountPercentage;

  // ✅ Type-wide coupon (e.g., all courses)
  if (coupon.applicableItemType && !coupon.applicableItemId) {
    const validForType = items.some(
      (i) => i.itemType === coupon.applicableItemType
    );
    if (!validForType) throw new AppError("Coupon not valid for these items");
    return coupon.discountPercentage;
  }

  // ✅ Specific item coupon
  const validForItem = items.some(
    (i) =>
      i.itemType === coupon.applicableItemType &&
      i.itemId.toString() === coupon.applicableItemId?.toString()
  );
  if (!validForItem) throw new AppError("Coupon not valid for selected items");

  return coupon.discountPercentage;
};

/**
 * Validates coupon and applies usage count.
 */
export const validateCoupon = async (
  couponCode: string,
  items: { itemType: EItemType; itemId: Types.ObjectId }[]
): Promise<number> => {
  const discount = await verifyCoupon(couponCode, items);

  const coupon = await Coupon.findOne({ code: couponCode });
  if (!coupon) throw new AppError("Coupon not found");

  coupon.usageCount = (coupon.usageCount || 0) + 1;
  await coupon.save();

  return discount;
};

/**
 * Gracefully attempts coupon validation. If invalid, returns 0.
 */
export const validateCouponOrSkip = async (
  couponCode: string,
  items: { itemType: EItemType; itemId: Types.ObjectId }[]
): Promise<number> => {
  try {
    return await validateCoupon(couponCode, items);
  } catch (err) {
    console.warn("Coupon skipped:", (err as Error).message);
    return 0;
  }
};

/**
 * Creates a new coupon.
 */
export const createCoupon = async ({
  code,
  discountPercentage,
  expiryDate,
  usageLimit,
  isActive = true,
  applicableItemType,
  applicableItemId,
}: {
  code: string;
  discountPercentage: number;
  expiryDate?: Date;
  usageLimit?: number;
  isActive?: boolean;
  applicableItemType?: EItemType;
  applicableItemId?: Types.ObjectId;
}) => {
  const existing = await Coupon.findOne({ code });
  if (existing) throw new AppError("Coupon code already exists");

  const newCoupon = await Coupon.create({
    code,
    discountPercentage,
    expiryDate,
    usageLimit,
    isActive,
    applicableItemType: applicableItemType ?? null,
    applicableItemId: applicableItemId ?? null,
  });

  return newCoupon;
};

/**
 * Retrieves coupon by ID.
 */
export const getCouponById = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw new AppError("Coupon not found");
  return coupon;
};

/**
 * Lists all coupons with optional filters.
 */
export const getAllCoupons = async (filters?: {
  applicableItemType?: EItemType;
  applicableItemId?: string;
  activeOnly?: boolean;
}) => {
  const query: any = {};

  if (filters?.applicableItemType)
    query.applicableItemType = filters.applicableItemType;

  if (filters?.applicableItemId)
    query.applicableItemId = filters.applicableItemId;

  if (filters?.activeOnly) {
    query.isActive = true;
    query.expiryDate = { $gt: new Date() };
  }

  return await Coupon.find(query).sort({ createdAt: -1 });
};

/**
 * Updates a coupon.
 */
export const updateCoupon = async (
  couponId: string,
  update: Partial<{
    code: string;
    discountPercentage: number;
    expiryDate: Date;
    usageLimit: number;
    isActive: boolean;
    applicableItemType: EItemType;
    applicableItemId: Types.ObjectId;
  }>
) => {
  const coupon = await Coupon.findByIdAndUpdate(couponId, update, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new AppError("Coupon not found");
  return coupon;
};

/**
 * Deletes a coupon.
 */
export const deleteCoupon = async (couponId: string) => {
  const deleted = await Coupon.findByIdAndDelete(couponId);
  if (!deleted) throw new AppError("Coupon not found");
  return deleted;
};
