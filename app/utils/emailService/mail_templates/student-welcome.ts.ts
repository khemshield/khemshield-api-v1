// src/services/templates/student-welcome.ts

interface StudentWelcomeProps {
  fullName: string;
  studentId: string;
}

import { baseEmailLayout } from "./base-email-layout";
import { paragraph, highlightBox, signOff } from "./emailHelpers";

export const generateStudentWelcomeHTML = ({
  fullName,
  studentId,
}: StudentWelcomeProps): string => {
  const body = `
    <h3 style="color: #48484A">Welcome to the Platform, ${fullName}!</h3>
    ${paragraph("We're excited to have you join our learning community.")}
    ${paragraph(
      "Your account has been successfully created and is now part of our student system. Below is your assigned Student ID:"
    )}
    ${highlightBox(studentId)}
    ${paragraph(
      "At this time, you don’t need to log in your student dashboard is not yet available. We’ll notify you as soon as your portal access is ready."
    )}
    ${paragraph(
      "If you have any questions or need support, feel free to reply to this email."
    )}
    ${signOff()}
  `;

  return baseEmailLayout({ title: "Welcome to Khemshield", body });
};
