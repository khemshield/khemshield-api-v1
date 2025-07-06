// src/services/user/user.notifier.ts

import { IUser, UserRole } from "./user.model";
import sendEmail from "../../utils/emailService/sendEmail";
import { generateResetHTMLTemp } from "../../utils/emailService/mail_templates/generateResetHTMLTemp";
import { generateStudentWelcomeHTML } from "../../utils/emailService/mail_templates/student-welcome.ts";
import { generatePasswordResetToken } from "../auth/utils/generateResetToken";
import { CLIENT_BASE_URL } from "../../config/contants";
import { Types } from "mongoose";

export class UserNotifier {
  static async sendWelcomeEmails({
    user,
    studentIdCardNo,
  }: {
    user: IUser;
    studentIdCardNo?: string;
  }) {
    const { firstName, lastName, email, roles } = user;

    // Send student welcome email
    if (roles.includes(UserRole.Student)) {
      await sendEmail({
        email,
        subject: "Welcome to our platform",
        html: generateStudentWelcomeHTML({
          fullName: `${firstName} ${lastName}`,
          studentId: studentIdCardNo!,
        }),
      });
    }

    // Send setup/reset link for instructor/admin
    if (roles.includes(UserRole.Instructor) || roles.includes(UserRole.Admin)) {
      const resetLink = `${CLIENT_BASE_URL}/reset-password?token=${await generatePasswordResetToken(
        user._id as Types.ObjectId
      )}`;

      await sendEmail({
        email,
        subject: "Set up your account",
        html: generateResetHTMLTemp({
          resetLink,
          reason: "setup",
        }),
      });
    }
  }
}
