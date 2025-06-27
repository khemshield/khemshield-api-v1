import { APP_NAME } from "../../config/contants";
import { AppError } from "../errors";
import mailTransporter from "./transporter";

type MailRecipientType = {
  email: string;
  html: string;
  subject: string;
  sender?: string;
};

const sendEmail = async ({
  email,
  html,
  subject,
  sender,
}: MailRecipientType) => {
  const fromEmail = process.env.EMAIL;

  if (fromEmail) {
    const mailOptions = {
      to: email,
      from: {
        name: sender || APP_NAME,
        address: fromEmail,
      },
      subject,
      html,
    };

    try {
      const info = await mailTransporter({
        host: process.env.EMAIL_HOST!,
        pass: process.env.EMAIL_PASS!,
        user: process.env.EMAIL!,
      }).sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error: any) {
      console.log("SENDING EMAIL FAILED", email, error);
      throw new AppError(error.message || "SENDING EMAIL FAILED", 502);
    }
  }
};

export default sendEmail;
