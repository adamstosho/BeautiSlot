const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

router.post('/', auth, roles('client'), bookingController.createBooking);
router.get('/', auth, roles('client'), bookingController.getBookings);
router.delete('/:id', auth, roles('client'), bookingController.cancelBooking);

module.exports = router; 