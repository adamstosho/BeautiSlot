const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Service = require('../models/Service');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

exports.createBooking = async (clientId, data) => {
  // Check service exists
  const service = await Service.findById(data.serviceId);
  if (!service) throw new Error('Service not found');
  
  // No longer check dayOfWeek directly in the booking creation
  const availability = await Availability.findOne({
    providerId: service.providerId,
    // Omitting dayOfWeek from this check for flexibility
    'slots.startTime': data.startTime,
    'slots.endTime': data.endTime
  });
  if (!availability) {
    // Enhanced error logging for debugging
    const allAvailabilities = await Availability.find({ providerId: service.providerId });
    console.error('[Booking] Slot not available:', {
      providerId: service.providerId,
      requested: { startTime: data.startTime, endTime: data.endTime },
      allAvailabilities: allAvailabilities.map(a => ({ dayOfWeek: a.dayOfWeek, slots: a.slots }))
    });
    throw new Error(`Slot not available. Requested: ${data.startTime}-${data.endTime}. ProviderId: ${service.providerId}`);
  }

  // Check for overlapping appointments
  const overlap = await Appointment.findOne({
    providerId: service.providerId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    status: { $in: ['pending', 'confirmed'] }
  });
  if (overlap) throw new Error('Slot already booked');
  // Create appointment
  const appointment = new Appointment({
    clientId,
    providerId: service.providerId,
    serviceId: data.serviceId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    status: 'pending',
    paymentStatus: 'unpaid'
  });
  await appointment.save();
  // Send email notifications
  const client = await User.findById(clientId);
  const provider = await User.findById(service.providerId);
  await sendEmail({
    to: client.email,
    subject: 'Booking Confirmation',
    html: `<p>Your booking for ${service.name} on ${data.date} at ${data.startTime} is pending confirmation.</p>`
  });
  await sendEmail({
    to: provider.email,
    subject: 'New Booking Received',
    html: `<p>You have a new booking for ${service.name} on ${data.date} at ${data.startTime} from ${client.name} (${client.email}).</p>`
  });
  return appointment;
};

exports.getBookings = async (clientId) => {
  return await Appointment.find({ clientId });
};

exports.cancelBooking = async (clientId, bookingId) => {
  const booking = await Appointment.findOne({ _id: bookingId, clientId });
  if (!booking) throw new Error('Booking not found');
  if (booking.status === 'completed') throw new Error('Cannot cancel a completed booking');
  booking.status = 'cancelled';
  await booking.save();
  // Send email notifications
  const client = await User.findById(clientId);
  const provider = await User.findById(booking.providerId);
  const service = await Service.findById(booking.serviceId);
  await sendEmail({
    to: client.email,
    subject: 'Booking Cancelled',
    html: `<p>Your booking for ${service.name} on ${booking.date} at ${booking.startTime} has been cancelled.</p>`
  });
  await sendEmail({
    to: provider.email,
    subject: 'Booking Cancelled',
    html: `<p>The booking for ${service.name} on ${booking.date} at ${booking.startTime} by ${client.name} (${client.email}) has been cancelled.</p>`
  });
  return booking;
}; 