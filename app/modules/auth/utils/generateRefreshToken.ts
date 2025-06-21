import jwt from "jsonwebtoken";

import { IUser } from "../../user/user.model";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
}
