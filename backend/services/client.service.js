const User = require('../models/User');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

exports.searchProviders = async (query) => {
  const filter = { role: 'provider' };
  if (query.category) filter.categories = query.category;
  if (query.location) filter.location = { $regex: query.location, $options: 'i' };
  return await User.find(filter).select('-passwordHash -portfolio');
};

exports.getProviderProfile = async (providerId) => {
  return await User.findOne({ _id: providerId, role: 'provider' }).select('-passwordHash');
};

exports.getProviderServices = async (providerId) => {
  return await Service.find({ providerId });
};

exports.getProviderPortfolio = async (providerId) => {
  const user = await User.findOne({ _id: providerId, role: 'provider' });
  return user ? user.portfolio : [];
};

exports.getProviderReviews = async (providerId) => {
  return await Review.find({ providerId });
};

exports.getProviderAvailability = async (providerId, date) => {
  if (!date) {
    throw new Error("Date is required");
  }

  const dayOfWeek = require('date-fns').format(new Date(date), 'EEEE'); // e.g., "Wednesday"

  // Get the provider's general availability for that day of the week (case-insensitive)
  const availability = await Availability.findOne({ 
    providerId, 
    dayOfWeek: new RegExp('^' + dayOfWeek + '$', 'i') 
  });
  if (!availability || !availability.slots) {
    return { slots: [] };
  }

  // Get all confirmed bookings for that specific date
  const bookings = await Appointment.find({
    providerId,
    date: date,
    status: { $in: ['pending', 'confirmed'] },
  });

  // Mark slots as unavailable if they are already booked (by overlap, not just startTime)
  const availableSlots = availability.slots.map(slot => {
    // Check for any booking that overlaps with this slot
    const slotStart = slot.startTime;
    const slotEnd = slot.endTime;
    const isBooked = bookings.some(b =>
      (b.startTime < slotEnd && b.endTime > slotStart)
    );
    return {
      startTime: slot.startTime,
      endTime: slot.endTime,
      available: !isBooked,
    };
  });

  return { slots: availableSlots };
}; 