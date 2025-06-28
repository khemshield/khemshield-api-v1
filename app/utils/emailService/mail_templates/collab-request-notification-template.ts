export const collabRequestNotificationTemplate = ({
  leadInstructorName,
  requesterName,
  courseTitle,
  message,
  actionUrl,
}: {
  leadInstructorName: string;
  requesterName: string;
  courseTitle: string;
  message?: string;
  actionUrl: string;
}) => `
  <p>Hello ${leadInstructorName},</p>
  <p><strong>${requesterName}</strong> has requested to collaborate on your course titled <strong>${courseTitle}</strong>.</p>
  <p><strong>Message:</strong> ${message || "No message provided."}</p>
  <p>
    <a href="${actionUrl}" style="display:inline-block; background:#0d6efd; padding:10px 20px; color:#fff; text-decoration:none; border-radius:4px;">
      Review Request
    </a>
  </p>
  <p>Regards,<br />The Team</p>
`;
