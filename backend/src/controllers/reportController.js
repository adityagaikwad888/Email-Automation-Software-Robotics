const EmailLog = require("../models/EmailLog");
const Campaign = require("../models/Campaign");

exports.getDeliveryReports = async (req, res) => {
  try {
    const reports = await EmailLog.find().populate("campaignId", "name");
    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving delivery reports",
      error: error.message,
    });
  }
};

exports.getCampaignReport = async (req, res) => {
  const { campaignId } = req.params;
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const reports = await EmailLog.find({ campaignId }).populate(
      "campaignId",
      "name"
    );
    res.status(200).json({
      success: true,
      campaign: campaign.name,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving campaign report",
      error: error.message,
    });
  }
};

exports.getAllReports = exports.getDeliveryReports;

exports.getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await EmailLog.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving report", error: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    // Basic implementation - can be enhanced
    const emailLogs = await EmailLog.find({});
    const report = {
      totalEmails: emailLogs.length,
      sent: emailLogs.filter((log) => log.status === "sent").length,
      failed: emailLogs.filter((log) => log.status === "failed").length,
      pending: emailLogs.filter((log) => log.status === "pending").length,
      generatedAt: new Date(),
    };
    res.status(200).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};

exports.deleteReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await EmailLog.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting report", error: error.message });
  }
};
