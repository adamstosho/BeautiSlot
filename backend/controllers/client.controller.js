const clientService = require('../services/client.service');

exports.searchProviders = async (req, res) => {
  try {
    const providers = await clientService.searchProviders(req.query);
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProviderProfile = async (req, res) => {
  try {
    const provider = await clientService.getProviderProfile(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProviderServices = async (req, res) => {
  try {
    const services = await clientService.getProviderServices(req.params.id);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProviderPortfolio = async (req, res) => {
  try {
    const portfolio = await clientService.getProviderPortfolio(req.params.id);
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await clientService.getProviderReviews(req.params.id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProviderAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const slots = await clientService.getProviderAvailability(req.params.id, date);
    res.json(slots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 