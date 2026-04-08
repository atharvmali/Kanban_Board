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

module.exports = {
  getWelcomeEmailTemplate
};
