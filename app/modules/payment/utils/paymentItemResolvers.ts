// utils/payment/itemResolvers.ts

import { Types } from "mongoose";
import { AppError } from "../../../utils/errors";
import { validateCouponOrSkip } from "../../coupon/coupon.service";
import Course from "../../course/course.model";
import { ensureCourseFromPredefined } from "../../course/utils/ensureCourseFromPredefined";
import { EItemType } from "../../enrollment/enrollment.model";
import { ItemsPurchaseType } from "../payment.service";

type PaymentItemResolver = (args: {
  itemId?: Types.ObjectId;
  predefinedId?: Types.ObjectId;
  couponCode?: string;
}) => Promise<ItemsPurchaseType>;

export const paymentItemResolvers: Record<EItemType, PaymentItemResolver> = {
  course: async ({
    itemId,
    predefinedId,
    couponCode,
  }: {
    itemId?: Types.ObjectId;
    predefinedId?: Types.ObjectId;
    couponCode?: string;
  }) => {
    let course;

    console.log("itemId: ", itemId);
    console.log("predefinedId: ", predefinedId);

    if (!itemId && !predefinedId) {
      throw new AppError("Either itemId or predefinedId is required");
    }

    if (itemId) {
      course = await Course.findById(itemId);
    }

    if (!course && predefinedId) {
      course = await ensureCourseFromPredefined(predefinedId);
    }

    console.log("course: ", course);
    if (!course) throw new AppError("Course not found");

    const originalPrice = course.price || 0;
    const courseDiscount = course.discountPercentage || 0;
    const couponDiscount = await validateCouponOrSkip(
      couponCode ?? "",
      course._id as Types.ObjectId
    );

    const discount = Math.max(courseDiscount, couponDiscount);

    const finalPrice = originalPrice - (originalPrice * discount) / 100;

    return {
      itemType: EItemType.Course,
      itemRef: course._id as Types.ObjectId,
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
