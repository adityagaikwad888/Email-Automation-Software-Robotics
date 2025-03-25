const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Route to create a new email template
router.post('/', templateController.createTemplate);

// Route to get all email templates
router.get('/', templateController.getAllTemplates);

// Route to get a specific email template by ID
router.get('/:id', templateController.getTemplateById);

// Route to update an existing email template by ID
router.put('/:id', templateController.updateTemplate);

// Route to delete an email template by ID
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;