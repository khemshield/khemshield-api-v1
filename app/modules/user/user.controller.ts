import { Request, Response } from "express";
import { Types } from "mongoose";
import { CLIENT_BASE_URL } from "../../config/contants";
import { generateResetHTMLTemp } from "../../utils/emailService/mail_templates/generateResetHTMLTemp";
import sendEmail from "../../utils/emailService/sendEmail";
import { registerUser } from "../auth/auth.service";
import { generatePasswordResetToken } from "../auth/utils/generateResetToken";
import { UserRole } from "../user/user.model";
import { searchUsers } from "../user/user.service";
import { generateTempPassword } from "./utils/generateTempPassword";

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
      mustChangePassword: true, // force change,
      phone,
      roles,
      createdBy: currentUser._id as Types.ObjectId,
    });

    const resetLink = `${CLIENT_BASE_URL}/reset-password?token=${await generatePasswordResetToken(
      newUser._id as Types.ObjectId
    )}`;

    await sendEmail({
      email,
      subject: "Set up your account",
      html: generateResetHTMLTemp({ resetLink, reason: "setup" }),
    });

    res.status(201).json({
      message: "User created. A password setup email has been sent.",
      user: newUser,
    });
  } catch (err: any) {
    console.error("Create user error:", err);
    res.status(500).json({ message: err.message || "User creation failed" });
  }
};

export const searchUsersController = async (req: Request, res: Response) => {
  try {
    const { q = "", role } = req.query;

    if (!role || typeof role !== "string") {
      return res.status(400).json({ message: "Role is required" });
    }

    const trimmedQuery = (q as string).trim();
    if (!trimmedQuery) {
      return res.json([]); // return empty results for empty query
    }

    const regex = new RegExp(trimmedQuery, "i");

    const users = await searchUsers(trimmedQuery, role);

    res.json(users);
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message || "Search failed" });
  }
};
