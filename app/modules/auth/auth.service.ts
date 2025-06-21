import bcrypt from "bcrypt";
import { Types } from "mongoose";
import AdminProfile from "../user/adminProfile.model";
import InstructorProfile from "../user/instructorProfile.model";
import StudentProfile from "../user/studentProfile.model";
import User, { IUser, UserRole } from "../user/user.model";
import { saveRefreshToken } from "./refresh.service";
import { generateAccessToken } from "./utils/generateAccessToken";
import { generateRefreshToken } from "./utils/generateRefreshToken";
import jwt from "jsonwebtoken";
import { JwtPayloadWithUserId } from "../../@types/jwt";
import { generateResetToken } from "./utils/generateResetToken";
import sendEmail from "../../utils/emailService/sendEmail";
import { API_VERSION } from "../../config/contants";

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: UserRole[];
  phone?: string; // Required for studentProfile
  mustChangePassword?: boolean;
  createdBy?: Types.ObjectId;
}

export const registerUser = async (
  data: RegisterInput
): Promise<Omit<IUser, "password">> => {
  const {
    email,
    password,
    roles = [UserRole.Student],
    firstName,
    lastName,
    phone,
  } = data;

  // 1. Check if email exists
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already in use");

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create initial user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    roles,
  });

  // 4. Create profile(s)
  if (roles.includes(UserRole.Student)) {
    if (!phone) throw new Error("Phone number is required for students");

    const studentProfile = await StudentProfile.create({
      user: newUser._id,
      phone,
    });

    newUser.studentProfile = studentProfile._id as Types.ObjectId;
  }

  if (roles.includes(UserRole.Instructor)) {
    const instructorProfile = await InstructorProfile.create({
      user: newUser._id,
      phone,
    });

    newUser.instructorProfile = instructorProfile._id as Types.ObjectId;
  }

  if (roles.includes(UserRole.Admin)) {
    const adminProfile = await AdminProfile.create({
      user: newUser._id,
      phone,
    });

    newUser.adminProfile = adminProfile._id as Types.ObjectId;
  }

  // 5. Save user
  await newUser.save();

  // 6. Remove password before returning
  newUser.password = undefined;

  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const validPassword = await bcrypt.compare(password, user.password!);
  if (!validPassword) throw new Error("Invalid credentials");

  // 🚨 Status checks
  if (user.accountStatus === "deactivated") {
    throw new Error("Account has been deactivated. Please contact support.");
  }

  if (user.accountStatus === "suspended") {
    throw new Error("Your account is suspended. Please contact support.");
  }

  if (!user._id) {
    throw new Error("Invalid user ID");
  }

  // Must change password check
  if (user.mustChangePassword) {
    return { mustChangePassword: true };
  }

  // Issue token, session, etc.
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  await saveRefreshToken({
    userId: user._id as Types.ObjectId,
    token: refreshToken,
  });

  return { accessToken, refreshToken };
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    if (!token || !newPassword) {
      throw new Error("Token and new password are required");
    }

    const decoded = jwt.verify(
      token,
      process.env.RESET_PASSWORD_SECRET!
    ) as JwtPayloadWithUserId;

    if (!decoded || !decoded.userId) {
      throw new Error("Invalid or expired token");
    }

    const user = await User.findById(decoded.userId);
    if (!user) throw new Error("User not found");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.mustChangePassword = false; // optional
    await user.save();

    return { message: "Password reset successful" };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });

  // Don’t reveal whether email exists
  if (!user) return;

  // Build reset link (your frontend route)
  const resetLink = `${
    process.env.API_BASE_URL + API_VERSION
  }/auth/reset-password?token=${generateResetToken(user._id!.toString())}`;

  const html = `
    <p>Hi ${user.firstName},</p>
    <p>You requested to reset your password. Please click the link below:</p>
    <a href="${resetLink}" target="_blank">Reset Your Password</a>
    <p>This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
    <br />
    <p>The Khemshield Team</p>
  `;

  await sendEmail({
    email: user.email,
    subject: "Reset Your Password",
    html,
  });
};
