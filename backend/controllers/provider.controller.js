const providerService = require('../services/provider.service');

exports.getProfile = async (req, res) => {
  try {
    const profile = await providerService.getProfile(req.user._id);
    if (!profile) return res.status(404).json({ message: 'Provider not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updated = await providerService.updateProfile(req.user._id, req.body);
    if (!updated) return res.status(404).json({ message: 'Provider not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const deleted = await providerService.deleteProfile(req.user._id);
    if (!deleted) return res.status(404).json({ message: 'Provider not found' });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Service CRUD
exports.createService = async (req, res) => {
  try {
    const service = await providerService.createService(req.user._id, req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateService = async (req, res) => {
  try {
    const updated = await providerService.updateService(req.user._id, req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteService = async (req, res) => {
  try {
    const deleted = await providerService.deleteService(req.user._id, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.listServices = async (req, res) => {
  try {
    const services = await providerService.listServices(req.user._id);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Availability CRUD
exports.setAvailability = async (req, res) => {
  try {
    const availability = await providerService.setAvailability(req.user._id, req.body);
    res.status(201).json(availability);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateAvailability = async (req, res) => {
  try {
    const updated = await providerService.updateAvailability(req.user._id, req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Availability not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteAvailability = async (req, res) => {
  try {
    const deleted = await providerService.deleteAvailability(req.user._id, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Availability not found' });
    res.json({ message: 'Availability deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAvailability = async (req, res) => {
  try {
    const availabilities = await providerService.getAvailability(req.user._id);
    res.json(availabilities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Portfolio
exports.uploadPortfolio = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });
    const caption = req.body.caption || '';
    const portfolioItem = await providerService.uploadPortfolio(req.user._id, req.file, caption);
    res.status(201).json(portfolioItem);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
exports.removePortfolio = async (req, res) => {
  try {
    await providerService.removePortfolio(req.user._id, req.params.id);
    res.json({ message: 'Portfolio item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
}; 