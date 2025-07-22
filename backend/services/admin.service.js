const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.listUsers = async () => {
  return await User.find();
};

exports.updateUserStatus = async (userId, status) => {
  const allowed = ['active', 'banned'];
  if (!allowed.includes(status)) throw new Error('Invalid status');
  const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
  if (!user) throw new Error('User not found');
  return user;
};

exports.deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error('User not found');
  return true;
};

exports.listBookings = async () => {
  return await Appointment.find();
};

exports.analytics = async () => {
  const totalUsers = await User.countDocuments();
  const totalProviders = await User.countDocuments({ role: 'provider' });
  const totalClients = await User.countDocuments({ role: 'client' });
  const totalBookings = await Appointment.countDocuments();
  const totalRevenue = 0; // Replace with real calculation if you have payment data
  const monthlyGrowth = 0; // Replace with real calculation if needed
  return { totalUsers, totalProviders, totalClients, totalBookings, totalRevenue, monthlyGrowth };
}; 