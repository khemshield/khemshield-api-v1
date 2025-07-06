import { Types } from "mongoose";
import Course from "../course/course.model";
import Enrollment, {
  DeliveryMethod,
  EItemType,
  EnrollmentStatus,
  PaymentProgressStatus,
} from "./enrollment.model";

import sendEmail from "../../utils/emailService/sendEmail";
import User from "../user/user.model";
import Payment from "../payment/payment.model";

interface EnrollUserToCoursesParams {
  userId: Types.ObjectId;
  courseIds: Types.ObjectId[];
  deliveryMode?: DeliveryMethod;
  enrolledAt?: Date;
  sourcePayment?: Types.ObjectId;
  amountPaid: number;
  totalFinalPrice?: number;
}

export const enrollUserToCourses = async ({
  userId,
  courseIds,
  sourcePayment,
  amountPaid,
  totalFinalPrice,
  deliveryMode = DeliveryMethod.InPerson,
  enrolledAt = new Date(),
}: EnrollUserToCoursesParams) => {
  const newlyEnrolledCourses: Types.ObjectId[] = [];

  // Fetch payment doc once to access final prices
  const paymentDoc = sourcePayment
    ? await Payment.findById(sourcePayment)
    : null;

  for (const courseId of courseIds) {
    const alreadyEnrolled = await Enrollment.findOne({
      user: userId,
      itemType: EItemType.Course,
      itemRef: courseId,
    });

    if (!alreadyEnrolled) {
      await Enrollment.create({
        user: userId,
        itemType: EItemType.Course,
        itemRef: courseId,
        enrolledAt,
        status: EnrollmentStatus.Active,
        deliveryMode,
        sourcePayment,
      });

      // ✅ Update payment progress correctly using finalPrice from paymentDoc
      if (
        typeof amountPaid === "number" &&
        typeof totalFinalPrice === "number" &&
        paymentDoc
      ) {
        const paymentItem = paymentDoc.items.find(
          (item) => item.itemRef.toString() === courseId.toString()
        );

        const coursePrice = paymentItem?.finalPrice || 1;
        const courseShare = coursePrice / totalFinalPrice;
        const courseAmountPaid = amountPaid * courseShare;

        await updateEnrollmentProgress(userId, courseId, {
          amountPaid: courseAmountPaid,
          totalCoursePrice: coursePrice,
        });
      }

      newlyEnrolledCourses.push(courseId);
    }
  }

  // ✅ Send email if user is enrolled in any new course
  if (newlyEnrolledCourses.length > 0 && paymentDoc) {
    const [courseDocs, userDoc] = await Promise.all([
      Course.find({ _id: { $in: newlyEnrolledCourses } }).select("title"),
      User.findById(userId).select("email"),
    ]);

    const totalOriginalPrice = paymentDoc.items.reduce(
      (sum, item) => sum + item.originalPrice,
      0
    );

    const discountListHtml = paymentDoc.items
      .map(
        (item) =>
          `<li>${item.name}: ${
            item.discountPercentage
          }% off (₦${item.finalPrice.toLocaleString()})</li>`
      )
      .join("");

    const balance = paymentDoc.totalAmount - amountPaid;

    const emailHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2 style="color: #2c3e50;">Congratulations!</h2>
    <p>You have been successfully enrolled in the following course(s):</p>
    <ul style="padding-left: 20px;">
      ${courseDocs.map((c) => `<li>${c.title}</li>`).join("")}
    </ul>

    <hr style="margin: 20px 0;" />

    <h3 style="color: #2c3e50;">Payment Summary</h3>
    <ul style="list-style: none; padding-left: 0;">
      <li><strong>Payment Reference:</strong> ${paymentDoc.reference}</li>
      <li><strong>Amount Paid:</strong> ₦${(
        amountPaid ?? 0
      ).toLocaleString()}</li>
      <li><strong>Total Price (Before Discount):</strong> ₦${totalOriginalPrice.toLocaleString()}</li>
      <li><strong>Total Price (After Discount):</strong> ₦${paymentDoc.totalAmount.toLocaleString()}</li>
      <li><strong>Balance Remaining:</strong> ₦${balance.toLocaleString()}</li>
      <li><strong>Payment Method:</strong> ${paymentDoc.paymentMethod}</li>
      <li><strong>Payment Date:</strong> ${new Date(
        paymentDoc.paidAt!
      ).toLocaleString()}</li>
    </ul>

    <h4 style="margin-top: 20px; color: #2c3e50;">Discount Details</h4>
    <ul style="padding-left: 20px;">
      ${discountListHtml}
    </ul>

    <p><strong>Delivery Mode:</strong> ${deliveryMode}</p>

    <p style="margin-top: 30px;">Thank you for choosing our platform!</p>
  </div>
`;

    await sendEmail({
      subject: "Enrollment Confirmation",
      email: userDoc?.email || "",
      html: emailHtml,
    });
  }

  return newlyEnrolledCourses.length;
};

export const updateEnrollmentProgress = async (
  userId: Types.ObjectId,
  courseId: Types.ObjectId,
  {
    amountPaid,
    totalCoursePrice,
  }: { amountPaid: number; totalCoursePrice: number }
) => {
  const enrollment = await Enrollment.findOne({
    user: userId,
    itemType: EItemType.Course,
    itemRef: courseId,
  });

  if (!enrollment) throw new Error("Enrollment not found");

  const newAmountPaid = (enrollment.amountPaid || 0) + amountPaid;
  const balanceRemaining = Math.max(totalCoursePrice - newAmountPaid, 0);

  enrollment.amountPaid = newAmountPaid;
  enrollment.balance = balanceRemaining;
  enrollment.isFullyPaid = newAmountPaid >= totalCoursePrice;

  enrollment.paymentProgressStatus = enrollment.isFullyPaid
    ? PaymentProgressStatus.Completed
    : PaymentProgressStatus.Partial;

  await enrollment.save();
  return enrollment;
};
