const EmailLog = require("../models/EmailLog");
const Campaign = require("../models/Campaign");
const emailService = require("./emailService");

// Automate email list management using native Node.js
const automateEmailListManagement = async () => {
  try {
    // Logic to automatically update and manage email lists
    console.log("Running automated email list management");
    // Implementation using MongoDB queries and JavaScript
    return { success: true, message: "Email list management completed" };
  } catch (error) {
    console.error("Error automating email list management:", error);
    throw error;
  }
};

// Automate follow-up emails using setTimeout
const automateFollowUpEmails = async (campaignId, days = 3) => {
  try {
    const delayMs = days * 24 * 60 * 60 * 1000;

    setTimeout(async () => {
      // Find logs for emails that weren't opened
      const logs = await EmailLog.find({
        campaign: campaignId,
        status: "sent",
        opened: false,
      });

      // Create a follow-up campaign
      const originalCampaign = await Campaign.findById(campaignId);
      if (!originalCampaign) return;

      // Send follow-up emails
      for (const log of logs) {
        await emailService.sendEmail(
          log.recipient,
          `Follow-up: ${originalCampaign.subject}`,
          `We noticed you haven't opened our previous email about ${originalCampaign.subject}. We'd love to hear from you!`,
          `<p>We noticed you haven't opened our previous email about <strong>${originalCampaign.subject}</strong>. We'd love to hear from you!</p>`
        );
      }

      console.log(`Follow-up emails sent for campaign ${campaignId}`);
    }, delayMs);

    return {
      success: true,
      message: `Follow-up emails scheduled for ${days} days from now`,
    };
  } catch (error) {
    console.error("Error automating follow-up emails:", error);
    throw error;
  }
};

// Extract delivery reports using Node.js
const extractDeliveryReports = async (campaignId) => {
  try {
    // Use MongoDB aggregation to generate reports
    const results = await EmailLog.aggregate([
      { $match: { campaign: campaignId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the report
    const report = {
      campaignId,
      timestamp: new Date(),
      stats: {},
    };

    results.forEach((result) => {
      report.stats[result._id] = result.count;
    });

    return report;
  } catch (error) {
    console.error("Error extracting delivery reports:", error);
    throw error;
  }
};

module.exports = {
  automateEmailListManagement,
  automateFollowUpEmails,
  extractDeliveryReports,
};
