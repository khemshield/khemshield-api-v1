export const generateContactHTMLTemp = (option: { name?: string }) => {
  return `
        <h4>
            Dear ${option.name || "user"},
        </h4>
        <p>
            Thank you for reaching out to us!      
        </p>
  
        <p>
            We have received your message and our team will review your inquiry as soon as possible. 
            We aim to respond within 24-48 hours. In the meantime, if you need immediate assistance, 
            feel free to contact us directly at +234-813-191-5694.
        </p>
      
        <p>
            Thank you for your patience, and we look forward to assisting you!
        </p>
  
        <p style="margin-bottom:0">
            Best regards,
        </p>
        <p style="margin:0">
            Khemshield Team,
        </p>
        <p style="margin:0">
            <a href="https://www.khemshield.com">khemshield.com</a>
        </p>
  `;
};
