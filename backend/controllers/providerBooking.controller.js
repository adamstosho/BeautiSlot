const providerBookingService = require('../services/providerBooking.service');

exports.listBookings = async (req, res) => {
  try {
    const bookings = await providerBookingService.listBookings(req.user.id); // Use .id for consistency
    res.json(bookings);
  } catch (err) {
    console.error("[ProviderBookings] Controller Error:", err); // Log the full error
    res.status(500).json({ message: 'Server error', error: err.message }); // Send back the error message
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await providerBookingService.updateBookingStatus(req.user._id, req.params.id, status);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Update failed' });
  }
}; 