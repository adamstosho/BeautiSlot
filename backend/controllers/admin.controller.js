const adminService = require('../services/admin.service');

exports.listUsers = async (req, res) => {
  try {
    const users = await adminService.listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await adminService.updateUserStatus(req.params.id, status);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Update failed' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Delete failed' });
  }
};

exports.listBookings = async (req, res) => {
  try {
    const bookings = await adminService.listBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.analytics = async (req, res) => {
  try {
    const stats = await adminService.analytics();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 