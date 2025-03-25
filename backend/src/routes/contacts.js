const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const upload = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");

// Create a new contact
router.post("/", contactController.createContact);

// Get all contacts
router.get("/", contactController.getAllContacts);

// Get a contact by ID
router.get("/:id", contactController.getContactById);

// Update a contact by ID
router.put("/:id", contactController.updateContact);

// Delete a contact by ID
router.delete("/:id", contactController.deleteContact);

// Import contacts from Excel file
router.post(
  "/import",
  authenticate,
  upload.single("file"),
  contactController.importContactsFromExcel
);

module.exports = router;
