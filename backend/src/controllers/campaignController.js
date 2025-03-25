const Campaign = require("../models/Campaign");
const schedulerService = require("../services/schedulerService"); // Add this import

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { name, subject, templateId, recipients, scheduledTime } = req.body;
    const newCampaign = new Campaign({
      name,
      subject,
      templateId,
      recipients,
      scheduledTime,
      status: scheduledTime ? "scheduled" : "draft",
    });

    await newCampaign.save();

    // Schedule the email dispatch if scheduledTime is provided
    if (scheduledTime) {
      // Convert to cron format or use the date directly depending on your scheduler implementation
      schedulerService.scheduleEmailDispatch(newCampaign._id, scheduledTime);
    }

    res.status(201).json({
      message: "Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating campaign", error: error.message });
  }
};

// Update an existing campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedCampaign = await Campaign.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({
      message: "Campaign updated successfully",
      campaign: updatedCampaign,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating campaign", error: error.message });
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await Campaign.findByIdAndDelete(id);
    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting campaign", error: error.message });
  }
};

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving campaigns", error: error.message });
  }
};

// Get a campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving campaign", error: error.message });
  }
};
