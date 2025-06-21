import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
}
