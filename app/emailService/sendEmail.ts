import nodemailer from "nodemailer";
import { generateEventRegisterHTMLTemp } from "./mail_templates/events";

type MailRecipientType = {
  email: string;
  firstName: string;
};

const sendEmail = async ({ email, firstName }: MailRecipientType) => {
  const fromEmail = process.env.EMAIL!;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // SMTP server address
    port: 465, // SMTP server port (usually 465 for secure, 587 for non-secure)
    secure: true, // True for 465, false for other ports
    auth: {
      user: fromEmail,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    to: email,
    from: {
      name: "Khemshield & Jidem Foundation",
      address: fromEmail,
    },
    subject: "Empowerment Series 2024 by Khemshield & Jidem Foundation",
    html: generateEventRegisterHTMLTemp({ firstName: firstName }),
    // attachments: [
    //   {
    //     filename: "khemshield profile",
    //     path: `./khemshield_profile.pdf`, // Stream or file path
    //   },
    // ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log("SENDING EMAIL FAILED", email, error);
  }
};

export default sendEmail;
