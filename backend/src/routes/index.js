const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const campaignRoutes = require('./campaigns');
const contactRoutes = require('./contacts');
const reportRoutes = require('./reports');
const templateRoutes = require('./templates');

router.use('/auth', authRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/contacts', contactRoutes);
router.use('/reports', reportRoutes);
router.use('/templates', templateRoutes);

module.exports = router;