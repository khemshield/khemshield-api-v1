// models/PasswordResetToken.ts
import { Schema, model, Types } from "mongoose";

interface IReesetToken extends Document {
  user: Types.ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
}

const passwordResetTokenSchema = new Schema<IReesetToken>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken = model<IReesetToken>(
  "PasswordResetToken",
  passwordResetTokenSchema
);
