const EmailService = require("../services/emailService");
const EmailLog = require("../models/EmailLog");

exports.sendEmail = async (req, res) => {
  const { to, subject, text, html, attachments } = req.body;

  try {
    const emailResponse = await EmailService.sendEmail({
      to,
      subject,
      text,
      html,
      attachments,
    });

    // Log the email delivery status
    await EmailLog.create({
      to,
      subject,
      status: "sent",
      response: emailResponse,
    });

    res
      .status(200)
      .json({ message: "Email sent successfully", response: emailResponse });
  } catch (error) {
    // Log the error
    await EmailLog.create({
      to,
      subject,
      status: "failed",
      response: error.message,
    });

    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};

exports.handleAttachments = (req, res) => {
  // Logic to handle attachments if needed
  res.status(200).json({ message: "Attachments processed" });
};

// Add this missing method used by webhooks
exports.logEmailStatus = async (emailId, status) => {
  try {
    const log = await EmailLog.findById(emailId);
    if (!log) {
      throw new Error("Email log not found");
    }
    log.status = status;
    await log.save();
    return { success: true };
  } catch (error) {
    console.error("Error updating email status:", error);
    throw error;
  }
};
