const nodemailer = require("nodemailer");
const emailConfig = require("../config/email");

// Create a transporter object using the default SMTP transport
// Log the config to debug what's actually being used
console.log("Email configuration:", {
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  // Don't log full credentials
  auth: { user: emailConfig.auth.user },
});

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass,
  },
});

// Function to send an email
const sendEmail = async (to, subject, text, html, attachments = []) => {
  const mailOptions = {
    from: emailConfig.auth.user,
    to,
    subject,
    text,
    html,
    attachments,
  };

  try {
    // Verify connection configuration before sending
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

// Function to send bulk emails
const sendBulkEmails = async (
  recipients,
  subject,
  text,
  html,
  attachments = []
) => {
  const results = [];
  for (const recipient of recipients) {
    try {
      const result = await sendEmail(
        recipient,
        subject,
        text,
        html,
        attachments
      );
      results.push({ recipient, result });
    } catch (error) {
      results.push({ recipient, error: error.message });
    }
  }
  return results;
};

module.exports = {
  sendEmail,
  sendBulkEmails,
};
