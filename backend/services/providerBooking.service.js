const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');

exports.listBookings = async (providerId) => {
  // Get all bookings for this provider
  const bookings = await Appointment.find({ providerId })
    .sort({ date: -1, startTime: 1 })
    .lean();

  // Defensive: handle both ObjectId and string id fields
  const validBookings = bookings.filter(b => {
    const sid = b.serviceId || b.service_id;
    const cid = b.clientId || b.client_id;
    return sid && cid && mongoose.Types.ObjectId.isValid(sid) && mongoose.Types.ObjectId.isValid(cid);
  });

  const skipped = bookings.length - validBookings.length;
  if (skipped > 0) {
    console.warn(`[ProviderBookings] Skipped ${skipped} bookings with invalid or missing serviceId/clientId.`);
  }

  if (validBookings.length === 0) {
    return [];
  }

  // Always use ObjectId for lookups
  const serviceIds = [...new Set(validBookings.map(b => new mongoose.Types.ObjectId(b.serviceId || b.service_id).toString()))];
  const clientIds = [...new Set(validBookings.map(b => new mongoose.Types.ObjectId(b.clientId || b.client_id).toString()))];

  const services = await Service.find({ _id: { $in: serviceIds } }).lean();
  const clients = await User.find({ _id: { $in: clientIds } }).lean();

  const serviceMap = Object.fromEntries(services.map(s => [s._id.toString(), s]));
  const clientMap = Object.fromEntries(clients.map(c => [c._id.toString(), c]));

  return validBookings.map(b => {
    const sid = b.serviceId || b.service_id;
    const cid = b.clientId || b.client_id;
    return {
      ...b,
      serviceName: serviceMap[new mongoose.Types.ObjectId(sid).toString()]?.name || "Service",
      price: serviceMap[new mongoose.Types.ObjectId(sid).toString()]?.price,
      clientName: clientMap[new mongoose.Types.ObjectId(cid).toString()]?.name || "Client",
      clientEmail: clientMap[new mongoose.Types.ObjectId(cid).toString()]?.email,
    };
  });
};

exports.updateBookingStatus = async (providerId, bookingId, status) => {
  const allowed = ['confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) throw new Error('Invalid status');
  const booking = await Appointment.findOne({ _id: bookingId, providerId });
  if (!booking) throw new Error('Booking not found');
  booking.status = status;
  await booking.save();
  return booking;
}; 