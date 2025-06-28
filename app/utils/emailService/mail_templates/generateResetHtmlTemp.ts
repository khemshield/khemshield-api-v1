export const generateResetHTMLTemp = (option: {
  resetLink: string;
  recipientName?: string;
  reason?: "reset" | "setup"; // Optional reason
}) => {
  const { resetLink, recipientName, reason = "reset" } = option;

  const introMessage =
    reason === "setup"
      ? "Your account has been created. Please set your password to activate it."
      : "You recently requested to reset your password. Please click the button below to proceed.";

  return `
    <p>Hello ${recipientName || ""},</p>

    <p>${introMessage}</p>

    <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#007BFF;color:white;text-decoration:none;border-radius:5px;">
      Reset Password
    </a>

    <p>This link will expire in 15 minutes. If you didn't initiate this action, you can safely ignore this email.</p>
    
    <br/>
    
    <p>The Khemshield Team</p>
  `;
};
