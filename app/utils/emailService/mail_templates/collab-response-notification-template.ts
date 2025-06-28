export const collabResponseNotificationTemplate = ({
  requesterName,
  courseTitle,
  action,
}: {
  requesterName: string;
  courseTitle: string;
  action: "accepted" | "rejected";
}) => `
  <p>Hello ${requesterName},</p>
  <p>Your request to collaborate on the course <strong>${courseTitle}</strong> has been <strong>${action}</strong>.</p>
  <p>Thank you for your interest and contribution.</p>
  <p>Warm regards,<br />The Team</p>
`;
