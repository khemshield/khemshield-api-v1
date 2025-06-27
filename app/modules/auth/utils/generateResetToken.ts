import crypto from "crypto";
import { PasswordResetToken } from "../reset-token.model";
import { Types } from "mongoose";

export const generatePasswordResetToken = async (userId: Types.ObjectId) => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await PasswordResetToken.create({
    user: userId,
    token: rawToken,
    expiresAt,
  });

  return rawToken;
};
