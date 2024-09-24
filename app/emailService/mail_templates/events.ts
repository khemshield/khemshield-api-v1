export const generateEventRegisterHTMLTemp = (option: { name?: string }) => {
  return `
    <h4>
        Dear ${option.name || "user"},
    </h4>
    <p>
      Thank you for registering for the Empowerment Series 2024: Empowering Warriors with On-Demand Skills for Stress-Free Remote Work, hosted by Khemshield in collaboration with the Jidem Foundation.
    </p>

    <h4>
        Event Details:
    </h4>

    <ul>
      <li>Duration: Two weeks</li>
      <li>Start Date: 24th Sept 2024</li>
      <li>End Date: 5th Oct 2024</li>
      <li>Certification Day: 19th Oct 2024 (Physical)</li>
      <li>Focus Areas: Cybersecurity and Web Development for Remote Work</li>
      <li>Venue Google Meet: Sessions will generally run from 4:00 PM to 6:00 PM WAT, with some exceptions. You will receive the link to join each day. However, if you joined the program after September 24th, feel free to use the following details to join the sessions:</li>
    </ul>

    <h4>
      Joining Details:
    </h4>
    
    <ul>
      <li>Join with Google Meet: https://meet.google.com/bqh-utfq-zsn</li>
      <li>Join by phone: dial +27 10 823 1266 and enter this PIN: 795 268 802# </li>
      <li>More phone numbers: https://tel.meet/bqh-utfq-zsn?hs=5</li>
    </ul>

    <p>
      We are excited to have you join us in this transformative experience, and we look forward to helping you enhance your skills for success in remote work.
    </p>
    
    <p>
      If you have any questions or need further information, feel free to reach out.
    </p>

    <p style="margin-bottom:0">
      Best regards,
    </p>
    <p style="margin:0">
      Khemshield Team.
    </p>
`;
};

export const generateEventSwitchUpdateHTMLTemp = (option: {
  name?: string;
  htmlString?: string;
}) => {
  return `
    <h4>
      Dear ${option.name || "user"},
    </h4>
    
    ${option.htmlString}
`;
};

// export const generateEventSwitchUpdateHTMLTemp = (option: {
//   name?: string;
// }) => {
//   return `
//     <h4>
//       Dear ${option.name || "user"},
//     </h4>
//     <p>
//       Thank you for registering for our upcoming Digital Skills Training event! We’re thrilled by the overwhelming response and have exceeded our initial target number of participants.
//     </p>
//     <p>
//       Based on survey feedback, many participants find Google Meet more accessible. Therefore, to ensure everyone can join comfortably, we are switching the event platform from Zoom to Google Meet. Please find the updated event details below:
//     </p>

//     <ul>
//       <li>🗓️ Event Dates: 24th September - 5th October</li>
//       <li>📍 Platform: Google Meet (the meeting link will be shared daily)</li>
//     </ul>

//     <p>
//       We’re excited to have you with us! If you have any questions, feel free to reach out.
//     </p>

//     <p style="margin-bottom:0">
//       Best regards,
//     </p>
//     <p style="margin:0">
//       Abdul Kareem Adamu,
//     </p>
//     <p style="margin:0">
//       CTO at Khemshield
//     </p>
// `;
// };
