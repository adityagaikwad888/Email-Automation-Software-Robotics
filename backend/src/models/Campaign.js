const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true,
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true,
    }],
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'sent', 'failed'],
        default: 'draft',
    },
    scheduledTime: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;