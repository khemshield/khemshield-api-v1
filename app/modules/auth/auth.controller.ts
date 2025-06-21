import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
} from "../auth/auth.service";
import { UserRole } from "../user/user.model";
import { generateAccessToken } from "./utils/generateAccessToken";
import { JwtPayloadWithUserId } from "../../@types/jwt";
import { resetPassword } from "../auth/auth.service";
import bcrypt from "bcrypt";
import User from "../user/user.model";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const newUser = await registerUser({
      firstName,
      lastName,
      email,
      password,
      phone,
      roles: [UserRole.Student],
    });

    res.status(201).json(newUser);
  } catch (err: any) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message || "Registration failed" });
  }
};

// Handles user login, generating access and refresh tokens.
export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken, mustChangePassword } = await loginUser(
      email,
      password
    );

    if (mustChangePassword) {
      return res.status(403).json({
        message: "Password change required",
        mustChangePassword: true,
      });
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, refreshToken });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
}

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_SECRET!
    ) as JwtPayloadWithUserId;

    if (!decoded?.userId)
      return res.status(403).json({ message: "Invalid token" });

    const accessToken = generateAccessToken(decoded.userId);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (err: any) {
    return res
      .status(401)
      .json({ message: "Refresh failed", error: err.message });
  }
};

export const requestPasswordResetController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    await requestPasswordReset(email);
    res
      .status(200)
      .json({ message: "If the email exists, a reset link was sent." });
  } catch (err: any) {
    console.error("Reset email error:", err.message);
    res.status(500).json({ message: "Failed to send reset link." });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const message = await resetPassword(token, newPassword);

    res.status(200).json({ message });
  } catch (err: any) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const meController = async (req: Request, res: Response) => {
  res.json(req.user);
};
