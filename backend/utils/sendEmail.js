const nodemailer = require("nodemailer");

const parseBoolean = (value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return undefined;
};

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SERVICE, NODE_ENV } = process.env;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const isProduction = NODE_ENV === "production";

  const explicitSecure = parseBoolean(process.env.SMTP_SECURE);
  const port = Number(SMTP_PORT || 587);
  const secure = explicitSecure !== undefined ? explicitSecure : port === 465;

  const smtpConfigured =
    (Boolean(SMTP_HOST) || Boolean(SMTP_SERVICE)) &&
    Boolean(smtpUser) &&
    Boolean(smtpPass);

  if (smtpConfigured) {
    const transportConfig = {
      secure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    };

    if (SMTP_SERVICE) {
      transportConfig.service = SMTP_SERVICE;
    } else {
      transportConfig.host = SMTP_HOST;
      transportConfig.port = port;
    }

    return nodemailer.createTransport(transportConfig);
  }

  if (isProduction) {
    throw new Error(
      "SMTP is not configured for production. Set SMTP_HOST or SMTP_SERVICE and SMTP_USER/SMTP_PASS (or EMAIL_USER/EMAIL_PASS)."
    );
  }

  // Dev fallback: email content is printed to console when SMTP is not configured.
  return nodemailer.createTransport({
    jsonTransport: true
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || smtpUser || "no-reply@kanban.local",
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
