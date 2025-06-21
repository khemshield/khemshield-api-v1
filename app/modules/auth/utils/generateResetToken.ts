import jwt from "jsonwebtoken";

const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET!; // create in your .env

export function generateResetToken(
  userId: string,
  expiresIn: "1hr" | "15m" = "15m"
) {
  return jwt.sign({ userId: userId }, RESET_PASSWORD_SECRET, {
    expiresIn: expiresIn,
  });
}
