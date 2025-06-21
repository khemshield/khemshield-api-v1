import { generateEventSwitchUpdateHTMLTemp } from "./mail_templates/events";
import mailTransporter from "./transporter";

// Function to send emails in batches
async function sendEmailsInBatches(
  emailConfig: { subject: string; html: string },
  recipients: { email: string; name?: string }[],
  batchSize = 49 // Maximum emails per hour
) {
  const delay = 3600000; // 1 hour in milliseconds
  const extraDelay = 120000; // 2 minutes in milliseconds

  console.log("emailConfig", emailConfig);
  console.log("recipients", recipients);
  console.log("batchSize", batchSize);

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    console.log("batch", batch);
    const sendPromises = batch.map((recipient) => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: recipient.email,
        subject: emailConfig.subject,
        html: generateEventSwitchUpdateHTMLTemp({
          htmlString: emailConfig.html,
          name: recipient.name,
        }), // Sending HTML content
      };
      console.log("process.env.EMAIL", process.env.EMAIL);
      return mailTransporter({
        host: process.env.EMAIL_HOST!,
        pass: process.env.EMAIL_PASS!,
        user: process.env.EMAIL!,
      }).sendMail(mailOptions);
    });

    try {
      await Promise.all(sendPromises);
      console.log(`Sent batch ${i / batchSize + 1}`);
    } catch (error) {
      console.error("Error sending batch:", error);
    }

    // Wait for 1 hour and then an additional 2 minutes
    await new Promise((resolve) => setTimeout(resolve, delay + extraDelay));
  }
}

export default sendEmailsInBatches;
