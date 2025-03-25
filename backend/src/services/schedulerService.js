const cron = require("node-cron");
const EmailService = require("./emailService");
const Campaign = require("../models/Campaign");
const EmailLog = require("../models/EmailLog");
const Template = require("../models/Template"); // Add this import

const scheduleEmailDispatch = (campaignId, scheduleTime) => {
  // For Date objects, convert to timestamp and create a one-time schedule
  const timestamp = new Date(scheduleTime);

  // Log the scheduled time for debugging
  console.log(`Campaign ${campaignId} scheduled for ${timestamp}`);

  // Simple timeout-based scheduling for exact dates
  const now = new Date();
  const delay = timestamp - now;

  if (delay < 0) {
    console.error(`Cannot schedule for a past time: ${timestamp}`);
    return;
  }

  setTimeout(async () => {
    try {
      const campaign = await Campaign.findById(campaignId)
        .populate("templateId")
        .populate("recipients");

      if (!campaign) {
        console.error(`Campaign with ID ${campaignId} not found.`);
        return;
      }

      // Extract email addresses from recipient objects
      const recipientEmails = campaign.recipients.map(
        (recipient) => recipient.email
      );

      if (recipientEmails.length === 0) {
        console.error(`No recipients found for campaign ${campaignId}`);
        return;
      }

      // Use template data from the populated templateId
      const template = campaign.templateId;
      if (!template) {
        console.error(`Template not found for campaign ${campaignId}`);
        return;
      }

      // Send emails using the email service
      const emailResults = await EmailService.sendBulkEmails(
        recipientEmails,
        campaign.subject,
        template.body, // Text version
        template.body // HTML version
      );

      // Update campaign status
      campaign.status = "sent";
      await campaign.save();

      // Log the results with the subject included
      console.log(`Campaign ${campaignId} executed. Results:`, emailResults);

      // Add subject to results before logging
      const resultsWithSubject = emailResults.map((result) => ({
        ...result,
        subject: campaign.subject,
      }));

      // Log to the database
      await logEmailDelivery(resultsWithSubject);
    } catch (error) {
      console.error(`Error executing campaign ${campaignId}:`, error);
      // Update campaign status to failed
      try {
        const campaign = await Campaign.findById(campaignId);
        if (campaign) {
          campaign.status = "failed";
          await campaign.save();
        }
      } catch (updateError) {
        console.error(`Error updating campaign status:`, updateError);
      }
    }
  }, delay);

  return true;
};

const logEmailDelivery = async (emailResults) => {
  for (const result of emailResults) {
    try {
      const emailLog = new EmailLog({
        recipient: result.recipient,
        // Add the required subject field
        subject: result.subject || "Campaign Email", // Provide a default if subject is missing
        status: result.error ? "failed" : "sent",
        errorMessage: result.error,
        sentAt: new Date(),
      });
      await emailLog.save();
    } catch (error) {
      console.error("Failed to save email log:", error);
    }
  }
};

module.exports = {
  scheduleEmailDispatch,
};
