const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

exports.createReview = async (clientId, data) => {
  // Check appointment exists, is completed, and belongs to client
  const appointment = await Appointment.findOne({ _id: data.appointmentId, clientId, status: 'completed' });
  if (!appointment) throw new Error('Appointment not found or not completed');
  // Check if already reviewed
  const existing = await Review.findOne({ appointmentId: data.appointmentId });
  if (existing) throw new Error('Already reviewed');
  // Create review
  const review = new Review({
    appointmentId: data.appointmentId,
    clientId,
    providerId: appointment.providerId,
    rating: data.rating,
    review: data.review
  });
  await review.save();
  return review;
}; 