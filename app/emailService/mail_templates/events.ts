export const generateEventRegisterHTMLTemp = (option: {
  firstName?: string;
}) => {
  return `
    <h4>
        Dear ${option.firstName || "user"},
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
      <li>Venue: Zoom (You will receive the link to join each day)</li>
      <li>Focus Areas: Cybersecurity and Web Development for Remote Work</li>
    </ul>

    <p>
      We are excited to have you join us in this transformative experience, and we look forward to helping you enhance your skills for success in remote work.
    </p>
    
    <p>
      If you have any questions or need further information, feel free to reach out.
    </p>

    <p>
        Best regards,
    </p>
    <p>
        Khemshield Team,
    </p>
`;
};
