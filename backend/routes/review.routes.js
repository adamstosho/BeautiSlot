const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

router.post('/', auth, roles('client'), reviewController.createReview);

module.exports = router; 