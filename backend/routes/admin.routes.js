const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

router.get('/users', auth, roles('admin'), controller.listUsers);
router.patch('/users/:id/status', auth, roles('admin'), controller.updateUserStatus);
router.delete('/users/:id', auth, roles('admin'), controller.deleteUser);
router.get('/bookings', auth, roles('admin'), controller.listBookings);
router.get('/analytics', auth, roles('admin'), controller.analytics);

module.exports = router; 