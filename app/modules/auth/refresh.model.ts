// models/RefreshToken.js
import mongoose, { Types, Schema } from "mongoose";

interface IRefreshToken extends Document {
  user: Types.ObjectId;
  token: string;
  ipAddress: string;
  createdAt: Date;
  expiresAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Optional: TTL index (Time To Live) on the expiresAt field:
// index to automatically delete expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);

export default RefreshToken;
