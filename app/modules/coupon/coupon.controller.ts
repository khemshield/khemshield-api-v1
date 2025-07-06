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

export const createCouponController = async (req: Request, res: Response) => {
  const parsed = CreateCouponSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error,
      errors: parsed.error.errors,
    });
  }

  const { code, discountPercentage, expiryDate, usageLimit, isActive, course } =
    req.body;

  const coupon = await createCoupon({
    code,
    discountPercentage,
    expiryDate,
    usageLimit,
    isActive,
    course,
  });

  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
};

export const getAllCouponsController = async (req: Request, res: Response) => {
  const { course, activeOnly } = req.query;
  const result = await getAllCoupons({
    course: course as string,
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
  const { code, courseId } = req.query;

  if (!code || !courseId)
    return res
      .status(400)
      .json({ message: "Coupon code and courseId are required" });

  const discount = await verifyCoupon(code as string, courseId as any);

  return res.json({
    success: true,
    valid: true,
    discountPercentage: discount,
  });
};

// ❗Do NOT expose validateCoupon as a public route – it increments usage count.
