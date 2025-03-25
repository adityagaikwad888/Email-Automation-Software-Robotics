const Template = require("../models/Template");

// Create a new email template
exports.createTemplate = async (req, res) => {
  try {
    const { name, subject, body } = req.body;
    const newTemplate = new Template({ name, subject, body });
    await newTemplate.save();
    res
      .status(201)
      .json({
        message: "Template created successfully",
        template: newTemplate,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating template", error: error.message });
  }
};

// Get all email templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving templates", error: error.message });
  }
};

// Update an email template
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, body } = req.body;
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { name, subject, body },
      { new: true }
    );
    if (!updatedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }
    res
      .status(200)
      .json({
        message: "Template updated successfully",
        template: updatedTemplate,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating template", error: error.message });
  }
};

// Delete an email template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTemplate = await Template.findByIdAndDelete(id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting template", error: error.message });
  }
};

// Add this missing method to match route reference
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving templates", error: error.message });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json(template);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving template", error: error.message });
  }
};
