// utils/generateProfileId.ts
import { format } from "date-fns";
import StudentProfile from "../studentProfile.model";
import InstructorProfile from "../instructorProfile.model";
import AdminProfile from "../adminProfile.model";

export const generateProfileId = async (
  role: "student" | "instructor" | "admin"
) => {
  const prefix =
    role === "student" ? "KSS" : role === "instructor" ? "KSI" : "KSA";
  const datePart = format(new Date(), "ddMMyy");

  let id: string;
  let isTaken = true;

  do {
    const uniquePart = Math.floor(100 + Math.random() * 900); // 3-digit
    id = `${prefix}-${datePart}${uniquePart}`;

    if (role === "student") {
      isTaken = !!(await StudentProfile.findOne({ studentId: id }));
    } else if (role === "instructor") {
      isTaken = !!(await InstructorProfile.findOne({ instructorId: id }));
    } else {
      isTaken = !!(await AdminProfile.findOne({ adminId: id }));
    }
  } while (isTaken);

  return id;
};
