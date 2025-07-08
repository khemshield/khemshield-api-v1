import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  createManualPaymentAndEnroll,
  getPaymentsByUser,
} from "./payment.service";
import { CreatePaymentSchema } from "./payment.validation";
import { DeliveryMethod } from "../enrollment/enrollment.model";
import asyncHandler from "express-async-handler";

export const recordManualPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsed = CreatePaymentSchema.safeParse(req.body);
    console.log("PARSESD: ", parsed.error, parsed.success);
    if (!parsed.success)
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });

    const {
      user,
      items,
      couponCode,
      amountPaid,
      deliveryMode = DeliveryMethod.InPerson,
      currency = "NGN",
    } = parsed.data;
    const adminUserId = req.user?._id;

    const result = await createManualPaymentAndEnroll({
      user: new Types.ObjectId(user),
      recordedBy: adminUserId as Types.ObjectId,
      items,
      currency,
      couponCode,
      deliveryMode,
      amountPaid,
    });

    res.status(201).json({
      success: true,
      message: "Manual payment recorded and enrollment completed",
      data: result,
    });
  } catch (error) {
    console.error("Error recordManualPaymentController:", error);
    res
      .status(500)
      .json({ message: (error as Error).message || "Failed to enroll" });
  }
};

// GET /api/payments/user/:userId
export const fetchPaymentssByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const payments = await getPaymentsByUser(userId);
    res.json({ data: payments });
  }
);
