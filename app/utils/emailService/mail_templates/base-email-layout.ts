// src/services/templates/layout/baseEmailLayout.ts

export const baseEmailLayout = ({
  title,
  body,
}: {
  title?: string;
  body: string;
}): string => {
  return `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Jost&display=swap" rel="stylesheet" />
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Jost', Arial, sans-serif;
            background-color: #f5f7fa;
          }

          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 8px rgba(0,0,0,0.05);
          }

          .email-header {
            background-color: #F43334;
            color: #ffffff;
            padding: 24px 32px;
            font-size: 20px;
            font-weight: bold;
          }

          .email-body {
            padding: 32px;
            font-size: 15px;
            color: #333333;
            line-height: 1.7;
          }

          .email-footer {
            padding: 24px 32px;
            font-size: 13px;
            color: #888888;
            border-top: 1px solid #eaeaea;
            background-color: #fafafa;
          }

          .highlight-box {
            background-color: #f4f4f4;
            border-left: 4px solid #2f80ed;
            padding: 12px 16px;
            margin: 20px 0;
            font-weight: bold;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          ${title ? `<div class="email-header">${title}</div>` : ""}
          <div class="email-body">
            ${body}
          </div>
          <div class="email-footer">
            This is an automated message. Please do not reply directly.<br/>
            &copy; ${new Date().getFullYear()} Khemshield. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
};
