import { Types } from "mongoose";
import Payment, { PaymentMethod, PaymentStatus } from "./payment.model";

import { DeliveryMethod, EItemType } from "../enrollment/enrollment.model";
import { enrollUserToCourses } from "../enrollment/enrollment.service";
import { PaymentItemType } from "./payment.validation";
import { generatePaymentReference } from "./utils/generatePaymentReference";
import { paymentItemResolvers } from "./utils/paymentItemResolvers";
import { AppError } from "../../utils/errors";
import Enrollment from "../enrollment/enrollment.model";

export type ItemsPurchaseType = {
  itemType: EItemType;
  itemRef: Types.ObjectId;
  name: string;
  originalPrice: number;
  discountPercentage: number;
  finalPrice: number;
};

type CreatePaymentInput = {
  items: ItemsPurchaseType[];
  user: Types.ObjectId;
  paymentMethod: PaymentMethod;
  recordedBy?: Types.ObjectId;
  couponCode?: string;
  currency?: string;
};

// Generic reusable payment creation accepting resolved items
export const createPayment = async ({
  items,
  user,
  paymentMethod,
  recordedBy,
  couponCode,
  currency = "NGN",
}: CreatePaymentInput) => {
  const totalAmount = items.reduce((sum, item) => sum + item.finalPrice, 0);

  const payment = await Payment.create({
    user,
    recordedBy: paymentMethod === PaymentMethod.Manual ? recordedBy : undefined,
    items,
    currency,
    totalAmount,
    paymentMethod,
    paymentStatus:
      paymentMethod === PaymentMethod.Manual
        ? PaymentStatus.Paid
        : PaymentStatus.Pending,
    reference: generatePaymentReference(paymentMethod),
    paidAt: paymentMethod === PaymentMethod.Manual ? new Date() : undefined,
    isVerified: paymentMethod === PaymentMethod.Manual,
    couponCode,
    metadata:
      paymentMethod === PaymentMethod.Manual && recordedBy
        ? { processedBy: recordedBy }
        : undefined,
  });

  return payment;
};

// Manual Payment + Auto-enroll wrapper
export const createManualPaymentAndEnroll = async ({
  user,
  recordedBy,
  items,
  couponCode,
  deliveryMode,
  amountPaid,
  currency = "NGN",
}: {
  user: Types.ObjectId;
  recordedBy: Types.ObjectId;
  currency?: string;
  couponCode?: string;
  deliveryMode: DeliveryMethod;
  amountPaid: number;
  items: PaymentItemType[];
}) => {
  // Prevents duplicate
  const uniqueItems = Array.from(
    new Map(
      items.map((i) => [`${i.itemType}_${i.itemId}_${i.predefinedId}`, i])
    ).values()
  );

  const resolvedItems = await Promise.all(
    uniqueItems.map(async (item) => {
      const resolver = paymentItemResolvers[item.itemType];
      if (!resolver) throw new Error(`Unsupported itemType: ${item.itemType}`);

      return await resolver({
        itemId: item.itemId ? new Types.ObjectId(item.itemId) : undefined,
        predefinedId: item.predefinedId
          ? new Types.ObjectId(item.predefinedId)
          : undefined,
        couponCode,
      });
    })
  );

  console.log("After resolvedItems is CALLED: ", resolvedItems);

  const totalFinalPrice = resolvedItems.reduce(
    (sum, item) => sum + item.finalPrice,
    0
  );

  // Ensures no payment is made for an already existing enrollment even partial
  const filteredItems = [];

  for (const item of resolvedItems) {
    const enrollmentExists = await Enrollment.exists({
      user,
      itemType: item.itemType,
      itemRef: new Types.ObjectId(item.itemRef),
    });

    const isAlreadyEnrolled =
      item.itemType === EItemType.Course && enrollmentExists;

    if (!isAlreadyEnrolled) filteredItems.push(item);
  }

  if (filteredItems.length === 0) {
    throw new AppError("User is already enrolled in all selected items");
  }

  const payment = await createPayment({
    items: resolvedItems,
    user,
    paymentMethod: PaymentMethod.Manual,
    recordedBy,
    couponCode,
    currency,
  });

  // Course specific enrollment
  const courseIds = resolvedItems
    .filter((item) => item.itemType === EItemType.Course)
    .map((item) => item.itemRef as Types.ObjectId);

  if (courseIds.length > 0) {
    // for (const courseId of courseIds) {
    await enrollUserToCourses({
      userId: user,
      courseIds,
      sourcePayment: payment._id as Types.ObjectId,
      deliveryMode,
      amountPaid,
      totalFinalPrice,
    });
  }

  return payment;
};

// Optional: Payment verification handler (e.g., webhook or dashboard confirmation)
export const verifyAndApplyPayment = async ({
  reference,
  userId,
  paymentStatus = PaymentStatus.Paid,
  paidAt = new Date(),
}: {
  userId: Types.ObjectId;
  reference: string;
  paymentStatus?: PaymentStatus;
  paidAt?: Date;
}) => {
  const payment = await Payment.findOne({ reference });
  if (!payment) throw new AppError("Payment not found");

  if (payment.isVerified) return payment;

  payment.paymentStatus = paymentStatus;
  payment.paidAt = paidAt;
  payment.isVerified = true;
  payment.recordedBy = userId;

  await payment.save();
  return payment;
};
