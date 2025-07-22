const express = require('express');
const router = express.Router();
const providerController = require('../controllers/provider.controller');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const upload = require('../utils/multer');

// Profile
router.get('/profile', auth, roles('provider'), providerController.getProfile);
router.put('/profile', auth, roles('provider'), providerController.updateProfile);
router.delete('/profile', auth, roles('provider'), providerController.deleteProfile);

// Services
router.post('/services', auth, roles('provider'), providerController.createService);
router.put('/services/:id', auth, roles('provider'), providerController.updateService);
router.delete('/services/:id', auth, roles('provider'), providerController.deleteService);
router.get('/services', auth, roles('provider'), providerController.listServices);

// Availability
router.post('/availability', auth, roles('provider'), providerController.setAvailability);
router.put('/availability/:id', auth, roles('provider'), providerController.updateAvailability);
router.delete('/availability/:id', auth, roles('provider'), providerController.deleteAvailability);
router.get('/availability', auth, roles('provider'), providerController.getAvailability);

// Portfolio
router.post('/portfolio', auth, roles('provider'), upload.single('image'), providerController.uploadPortfolio);
router.delete('/portfolio/:id', auth, roles('provider'), providerController.removePortfolio);

module.exports = router; 