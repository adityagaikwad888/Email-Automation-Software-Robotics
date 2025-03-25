const EmailLog = require('../models/EmailLog');

const trackingService = {
    logEmailDelivery: async (emailData) => {
        try {
            const emailLog = new EmailLog(emailData);
            await emailLog.save();
            return { success: true, message: 'Email delivery logged successfully.' };
        } catch (error) {
            console.error('Error logging email delivery:', error);
            return { success: false, message: 'Failed to log email delivery.' };
        }
    },

    getDeliveryReports: async (filter) => {
        try {
            const reports = await EmailLog.find(filter);
            return { success: true, data: reports };
        } catch (error) {
            console.error('Error retrieving delivery reports:', error);
            return { success: false, message: 'Failed to retrieve delivery reports.' };
        }
    },

    trackEmailEngagement: async (emailId) => {
        try {
            const emailLog = await EmailLog.findById(emailId);
            if (!emailLog) {
                return { success: false, message: 'Email log not found.' };
            }
            emailLog.opened = true; // Example of tracking an open event
            await emailLog.save();
            return { success: true, message: 'Email engagement tracked successfully.' };
        } catch (error) {
            console.error('Error tracking email engagement:', error);
            return { success: false, message: 'Failed to track email engagement.' };
        }
    }
};

module.exports = trackingService;