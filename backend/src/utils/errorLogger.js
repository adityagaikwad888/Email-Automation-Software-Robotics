const fs = require('fs');
const path = require('path');

const logError = (error) => {
    const errorLogPath = path.join(__dirname, 'error.log');
    const errorMessage = `${new Date().toISOString()} - ${error.message}\n`;

    fs.appendFile(errorLogPath, errorMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
};

module.exports = {
    logError,
};