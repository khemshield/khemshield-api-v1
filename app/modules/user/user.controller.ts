// controllers/user.controller.ts
import { Request, Response } from "express";
import { registerUser } from "../auth/auth.service";
import { UserRole } from "../user/user.model";
import { Types } from "mongoose";
import { generateTempPassword } from "./utils/generateTempPassword";
import sendEmail from "../../utils/emailService/sendEmail";
import { generateResetHtmlTemp } from "../../utils/emailService/mail_templates/generateResetHtmlTemp";
import { generateResetToken } from "../auth/utils/generateResetToken";
import { API_VERSION } from "../../config/contants";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    const {
      firstName,
      lastName,
      email,
      phone,
      roles = [UserRole.Student],
    } = req.body;

    if (!currentUser)
      return res.status(403).json({ message: "Authentication is required" });

    // Only admins can assign roles
    const isAdmin = currentUser.roles.includes(UserRole.Admin);
    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized to assign roles" });
    }

    const newUser = await registerUser({
      firstName,
      lastName,
      email,
      password: generateTempPassword(),
      mustChangePassword: true, // force change,
      phone,
      roles,
      createdBy: currentUser._id as Types.ObjectId,
    });

    const resetLink = `${
      process.env.API_BASE_URL + API_VERSION
    }/auth/reset-password?token=${generateResetToken(newUser._id!.toString())}`;

    await sendEmail({
      email,
      subject: "Reset Your Password",
      html: generateResetHtmlTemp({ resetLink }),
    });

    res.status(201).json(newUser);
  } catch (err: any) {
    console.error("Create user error:", err);
    res.status(500).json({ message: err.message || "User creation failed" });
  }
};
