const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { authenticate } = require('../middleware/auth');

// Create a new campaign
router.post('/', authenticate, campaignController.createCampaign);

// Get all campaigns
router.get('/', authenticate, campaignController.getAllCampaigns);

// Get a specific campaign by ID
router.get('/:id', authenticate, campaignController.getCampaignById);

// Update a campaign by ID
router.put('/:id', authenticate, campaignController.updateCampaign);

// Delete a campaign by ID
router.delete('/:id', authenticate, campaignController.deleteCampaign);

module.exports = router;