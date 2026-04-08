const getWelcomeEmailTemplate = ({ userName, dashboardUrl }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to Kanban Board</title>
    </head>
    <body style="margin:0;padding:0;background-color:#fff7ed;font-family:Arial,sans-serif;color:#1f2937;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fff7ed;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #fed7aa;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="background:#ea580c;padding:20px 24px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:24px;line-height:1.3;">Welcome to Kanban Board</h1>
                  <p style="margin:8px 0 0;font-size:14px;line-height:1.5;opacity:0.95;">Organize work. Track progress. Deliver faster.</p>
                </td>
              </tr>

              <tr>
                <td style="padding:24px;">
                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi ${userName},</p>
                  <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;">
                    Your account is ready. You can now create boards, add tasks, and collaborate with a clear visual workflow.
                  </p>

                  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:20px 0;">
                    <tr>
                      <td style="border-radius:8px;background:#ea580c;">
                        <a href="${dashboardUrl}" style="display:inline-block;padding:12px 20px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;">
                          Go to your dashboard
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#4b5563;">
                    Quick tips to get started:
                  </p>
                  <ul style="margin:0 0 16px 20px;padding:0;color:#4b5563;font-size:14px;line-height:1.6;">
                    <li>Create separate boards for personal and team work.</li>
                    <li>Use columns like Todo, In Progress, and Done.</li>
                    <li>Drag and drop tasks to keep progress updated.</li>
                  </ul>

                  <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
                    If you did not create this account, please ignore this email.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:16px 24px;background:#fffaf4;border-top:1px solid #fed7aa;">
                  <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;text-align:center;">
                    Need help? Contact us at support@kanbanboard.local
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

const getResetPasswordEmailTemplate = ({ userName, resetUrl }) => {
  const safeName = userName || "there";

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7fb;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:18px 24px;background:#111827;color:#ffffff;text-align:center;">
                  <div style="font-size:13px;opacity:0.85;letter-spacing:0.4px;">KANBAN BOARD</div>
                  <h1 style="margin:6px 0 0;font-size:24px;line-height:1.3;">Reset Your Password</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:26px 24px 20px;">
                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi ${safeName},</p>
                  <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;">
                    We received a request to reset your password for your Kanban Board account.
                  </p>
                  <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4b5563;">
                    Click the button below to set a new password. For your security, this link is valid for 15 minutes.
                  </p>

                  <!-- Button uses table structure for better Gmail/Outlook compatibility. -->
                  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:20px 0 16px;">
                    <tr>
                      <td style="border-radius:8px;background:#2563eb;">
                        <a href="${resetUrl}" style="display:inline-block;padding:12px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.2px;">
                          Reset Your Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#6b7280;">
                    If the button does not work, copy and paste this link into your browser:
                  </p>
                  <p style="margin:0 0 16px;font-size:13px;line-height:1.6;word-break:break-all;">
                    <a href="${resetUrl}" style="color:#2563eb;text-decoration:none;">${resetUrl}</a>
                  </p>

                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 16px;" />

                  <p style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;">
                    If you did not request this, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:14px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;text-align:center;font-size:12px;line-height:1.6;color:#9ca3af;">
                    Need help? Contact support@kanbanboard.local
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

module.exports = {
  getWelcomeEmailTemplate,
  getResetPasswordEmailTemplate
};
