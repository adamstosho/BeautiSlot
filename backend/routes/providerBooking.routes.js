const express = require('express');
const router = express.Router();
const controller = require('../controllers/providerBooking.controller');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

router.get('/bookings', auth, roles('provider'), controller.listBookings);
router.patch('/bookings/:id/status', auth, roles('provider'), controller.updateBookingStatus);
router.get('/bookings/test', (req, res) => {
    res.send("Provider bookings route working");
  });

module.exports = router; 