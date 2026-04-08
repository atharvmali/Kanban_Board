const nodemailer = require("nodemailer");

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT } = process.env;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (SMTP_HOST && SMTP_PORT && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  }

  // Dev fallback: email content is printed to console when SMTP is not configured.
  return nodemailer.createTransport({
    jsonTransport: true
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@kanban.local",
    to,
    subject,
    text,
    html
  });

  if (!process.env.SMTP_HOST) {
    console.log("Email payload (dev mode):", info.message);
  }
};

module.exports = sendEmail;
