const bookingService = require('../services/booking.service');

exports.createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.user._id, req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Booking failed' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getBookings(req.user._id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.user._id, req.params.id);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Cancel failed' });
  }
}; 