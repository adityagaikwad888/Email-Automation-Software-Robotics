const Contact = require("../models/Contact");
const xlsx = require("xlsx");
const fs = require("fs");

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a contact by ID
exports.updateContact = async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedContact)
      return res.status(404).json({ message: "Contact not found" });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact)
      return res.status(404).json({ message: "Contact not found" });
    return res.status(200).json({ message: "Contact deleted successfully" }); // Fixed
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this method to the existing contactController file
exports.importContactsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file",
      });
    }

    const filePath = req.file.path;

    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const contacts = xlsx.utils.sheet_to_json(worksheet);

    if (contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Excel file has no data",
      });
    }

    // Process contacts
    const results = {
      total: contacts.length,
      imported: 0,
      failed: 0,
      errors: [],
    };

    for (const contactData of contacts) {
      try {
        // Check required fields
        if (!contactData.name || !contactData.email) {
          results.failed++;
          results.errors.push(
            `Row missing required fields (name, email): ${JSON.stringify(
              contactData
            )}`
          );
          continue;
        }

        // Format data
        const newContact = {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || "",
          interests: contactData.interests
            ? contactData.interests.split(",").map((i) => i.trim())
            : [],
        };

        // Check if contact already exists
        const existingContact = await Contact.findOne({
          email: newContact.email,
        });
        if (existingContact) {
          results.failed++;
          results.errors.push(`${newContact.email} already exists`);
          continue;
        }

        // Create the contact
        await Contact.create(newContact);
        results.imported++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Error with ${contactData.email || "unknown"}: ${error.message}`
        );
      }
    }

    // Clean up - delete the file after processing
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Contacts imported successfully",
      results,
    });
  } catch (error) {
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to import contacts",
      error: error.message,
    });
  }
};
