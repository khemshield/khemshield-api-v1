// --- coupon.controller.ts ---
import { Request, Response } from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  verifyCoupon,
} from "../coupon/coupon.service";
import { CreateCouponSchema } from "./coupon.validation";
import { EItemType } from "../enrollment/enrollment.model";
import { Types } from "mongoose";

export const createCouponController = async (req: Request, res: Response) => {
  const parsed = CreateCouponSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.message,
      errors: parsed.error.errors,
    });
  }

  const {
    code,
    discountPercentage,
    expiryDate,
    usageLimit,
    isActive,
    applicableItemType,
    applicableItemId,
  } = parsed.data;

  const coupon = await createCoupon({
    code,
    discountPercentage,
    expiryDate,
    usageLimit,
    isActive,
    applicableItemType,
    applicableItemId: new Types.ObjectId(applicableItemId),
  });

  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
};

export const getAllCouponsController = async (req: Request, res: Response) => {
  const { applicableItemType, applicableItemId, activeOnly } = req.query;
  const result = await getAllCoupons({
    applicableItemType: applicableItemType as EItemType,
    applicableItemId: applicableItemId as string,
    activeOnly: activeOnly === "true",
  });

  return res.json({ success: true, data: result });
};

export const getCouponByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await getCouponById(id);
  return res.json({ success: true, data: coupon });
};

export const deleteCouponController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await deleteCoupon(id);
  return res.json({ success: true, message: "Coupon deleted", data: deleted });
};

export const updateCouponController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await updateCoupon(id, req.body);
  return res.json({ success: true, message: "Coupon updated", data: updated });
};

export const verifyCouponController = async (req: Request, res: Response) => {
  const { code, items } = req.body;

  if (!code || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const discount = await verifyCoupon(code, items);
    return res.json({ valid: true, discountPercentage: discount });
  } catch (err: any) {
    return res.status(400).json({
      valid: false,
      message: err.message || "Invalid coupon",
    });
  }
};

// ❗Do NOT expose validateCoupon as a public route – it increments usage count.
