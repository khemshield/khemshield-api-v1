import mailTransporter from "./transporter";

type MailRecipientType = {
  email: string;
  html: string;
  subject: string;
  name?: string;
};

const sendEmail = async ({ email, html, subject, name }: MailRecipientType) => {
  const fromEmail = process.env.EMAIL;

  if (fromEmail) {
    const mailOptions = {
      to: email,
      from: {
        name: name || "Khemshield",
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
    } catch (error) {
      console.log("SENDING EMAIL FAILED", email, error);
    }
  }
};

export default sendEmail;
