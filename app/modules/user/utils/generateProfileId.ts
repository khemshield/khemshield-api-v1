// utils/generateProfileId.ts
import { format } from "date-fns";
import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nanoid = customAlphabet(alphabet, 3); // 3-character ID

export const generateProfileId = (role: "student" | "instructor" | "admin") => {
  const prefix =
    role === "student" ? "KSS" : role === "instructor" ? "KSI" : "KSA";
  const datePart = format(new Date(), "yyMMdd");
  const uniquePart = nanoid(); // e.g., F9T

  return `${prefix}-${datePart}${uniquePart}`;
};
