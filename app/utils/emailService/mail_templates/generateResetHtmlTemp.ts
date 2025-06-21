export const generateResetHtmlTemp = (option: { resetLink: string }) => {
  const { resetLink } = option;
  return `

   <p>Hello,</p>
    <p>You recently requested to reset your password. Please click the button below to proceed:</p>
    <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#007BFF;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>This link will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
    <p>— The Khemshield Team</p>
    
  `;
};
