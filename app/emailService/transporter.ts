import nodemailer from "nodemailer";

const mailTransporter = (config: {
  host: string;
  user: string;
  pass: string;
}) =>
  nodemailer.createTransport({
    host: config.host, // SMTP server address
    port: 465, // SMTP server port (usually 465 for secure, 587 for non-secure)
    secure: true, // True for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.pass,
    },
    pool: true,
    maxConnections: 5,
  });

export default mailTransporter;
