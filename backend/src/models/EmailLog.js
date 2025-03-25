const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
    recipient: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['sent', 'failed', 'pending'],
        default: 'pending',
    },
    sentAt: {
        type: Date,
    },
    errorMessage: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

module.exports = EmailLog;