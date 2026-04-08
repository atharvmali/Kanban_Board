const sendEmail = require("./sendEmail");
const { getWelcomeEmailTemplate } = require("./emailTemplates");

const sendWelcomeEmail = async (userEmail, userName) => {
  const dashboardUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5050";

  const html = getWelcomeEmailTemplate({
    userName,
    dashboardUrl
  });

  const text = `Hi ${userName}, welcome to Kanban Board! Start here: ${dashboardUrl}`;

  await sendEmail({
    to: userEmail,
    subject: "Welcome to Kanban Board 🚀",
    text,
    html
  });
};

module.exports = sendWelcomeEmail;
