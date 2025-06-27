import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayloadWithUserId } from "../../@types/jwt";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../auth/auth.service";
import { UserRole } from "../user/user.model";
import { deleteRefreshToken } from "./refresh.service";
import { generateAccessToken } from "./utils/generateAccessToken";
import { AppError } from "../../utils/errors";
import { isProduction } from "../../config/contants";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const newUser = await registerUser({
      firstName,
      lastName,
      email,
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
  const { email, password, role } = req.body;

  try {
    const { accessToken, refreshToken, mustChangePassword } = await loginUser(
      email,
      password,
      role
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
      secure: isProduction,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: isProduction,
    });

    res.json({ accessToken, refreshToken });
  } catch (err: any) {
    console.error("Login error:", err);

    const status = err.statusCode || 500; // <-- support AppError statusCode
    const message = err.message || "Login failed";

    res.status(status).json({ message });
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
      secure: isProduction,
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

    res.status(200).json(message);
  } catch (err: any) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const meController = async (req: Request, res: Response) => {
  res.json(req.user);
};

// Handles user logout, deleting token in the database.
export async function logoutController(req: Request, res: Response) {
  const refreshToken =
    req.cookies.refreshToken ||
    req.body.refreshToken ||
    req.headers["x-refresh-token"];

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  // Remove refresh token from DB
  await deleteRefreshToken(refreshToken);

  // Clear cookies if they exist
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.json({ message: "Logged out successfully" });
}
