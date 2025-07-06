export const paragraph = (text: string) => `<p>${text}</p>`;

export const highlightBox = (text: string) => `
  <div style="padding: 10px 15px; background-color: #f4f4f4; border-left: 4px solid #FCC0C0; margin: 15px 0;">
    <strong style="font-size: 16px;">${text}</strong>
  </div>
`;

export const signOff = () => `
  <p style="margin-top: 30px;">
    Best regards,<br/>
    <strong>The Team</strong><br/>
    <span style="color: #888;">(This is an automated message – please do not share your Student ID)</span>
  </p>
`;
