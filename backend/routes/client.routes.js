const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

router.get('/providers', clientController.searchProviders);
router.get('/providers/:id', clientController.getProviderProfile);
router.get('/providers/:id/services', clientController.getProviderServices);
router.get('/providers/:id/portfolio', clientController.getProviderPortfolio);
router.get('/providers/:id/reviews', clientController.getProviderReviews);
router.get('/providers/:id/availability', clientController.getProviderAvailability); // Added route

module.exports = router; 