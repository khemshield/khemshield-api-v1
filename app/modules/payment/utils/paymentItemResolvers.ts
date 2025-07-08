// utils/payment/itemResolvers.ts

import { Types } from "mongoose";
import { AppError } from "../../../utils/errors";
import { validateCouponOrSkip } from "../../coupon/coupon.service";
import Course, { ICourse } from "../../course/course.model";
import { ensureCourseFromPredefined } from "../../course/utils/ensureCourseFromPredefined";
import { EItemType } from "../../enrollment/enrollment.model";
import { ItemsPurchaseType } from "../payment.service";
import { resolvePerItemAmountPaid } from "./resolvePerItemAmountPaid";
import { PaymentItemType } from "../payment.validation";

type PaymentItemResolver = (args: {
  itemId?: Types.ObjectId;
  predefinedId?: Types.ObjectId;
  couponCode?: string;
}) => Promise<ItemsPurchaseType>;

export const paymentItemResolvers: Record<EItemType, PaymentItemResolver> = {
  Course: async ({
    itemId,
    predefinedId,
    couponCode,
  }: {
    itemId?: Types.ObjectId;
    predefinedId?: Types.ObjectId;
    couponCode?: string;
  }) => {
    let course: ICourse | null = null;

    if (!itemId && !predefinedId) {
      throw new AppError("Either itemId or predefinedId is required");
    }

    if (itemId) {
      course = await Course.findById(itemId);
    }

    if (!course && predefinedId) {
      course = await ensureCourseFromPredefined(predefinedId);
    }

    if (!course) throw new AppError("Course not found");

    const originalPrice = course.price || 0;
    const courseDiscount = course.discountPercentage || 0;

    const couponDiscount = await validateCouponOrSkip(couponCode ?? "", [
      {
        itemType: EItemType.Course,
        itemId: course._id as Types.ObjectId,
      },
    ]);

    const discount = Math.max(courseDiscount, couponDiscount);
    const finalPrice = originalPrice - (originalPrice * discount) / 100;

    return {
      itemType: EItemType.Course,
      itemRef: course._id as Types.ObjectId, // explicitly assert type here
      name: course.title,
      originalPrice,
      discountPercentage: discount,
      finalPrice,
    };
  },

  // certificate: async ({
  //   itemId,
  //   couponCode,
  // }: {
  //   itemId?: string;
  //   couponCode?: string;
  // }) => {
  //   //   if (!itemId) throw new AppError("Certificate ID is required");
  //   // const certificate = await Certificate.findById(itemId);
  //   // if (!certificate) throw new AppError("Certificate not found");
  //   // const originalPrice = certificate.price;
  //   // const discount = certificate.discountPercentage || 0;
  //   // const finalPrice = originalPrice - (originalPrice * discount) / 100;
  //   return {
  //     itemType: EItemType.Certificate,
  //     itemRef: "certificate._id",
  //     name: "certificate.title",
  //     originalPrice: 2000,
  //     discountPercentage: 10,
  //     finalPrice: 1990,
  //   };
  // },
};

export interface PaymentItemWithFinalPrice {
  finalPrice: number;
  [key: string]: any; // allow other properties
}

export const attachAmountPaid = <T extends PaymentItemWithFinalPrice>(
  items: T[],
  totalPaid: number
): (T & { amountPaid: number })[] => {
  const perItemPaid = resolvePerItemAmountPaid(items, totalPaid);

  return items.map((item, i) => ({
    ...item,
    amountPaid: perItemPaid[i],
  }));
};

export const resolveItemsWithPayment = async (
  items: PaymentItemType[],
  couponCode: string | undefined,
  amountPaid: number
) => {
  const rawItems = await Promise.all(
    items.map(async (item) => {
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

  return attachAmountPaid(rawItems, amountPaid);
};
