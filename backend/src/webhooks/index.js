const express = require('express');
const router = express.Router();
const emailLogController = require('../controllers/emailController');

// Handle incoming webhook notifications
router.post('/email-status', async (req, res) => {
    const { emailId, status } = req.body;

    if (!emailId || !status) {
        return res.status(400).json({ message: 'Email ID and status are required.' });
    }

    try {
        // Log the email delivery status
        await emailLogController.logEmailStatus(emailId, status);
        res.status(200).json({ message: 'Status received and logged successfully.' });
    } catch (error) {
        console.error('Error logging email status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;