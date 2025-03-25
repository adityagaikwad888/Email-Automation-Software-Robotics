const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Route to get all email delivery reports
router.get('/', reportController.getAllReports);

// Route to get a specific email delivery report by ID
router.get('/:id', reportController.getReportById);

// Route to generate a new email delivery report
router.post('/', reportController.generateReport);

// Route to delete a specific email delivery report by ID
router.delete('/:id', reportController.deleteReportById);

module.exports = router;