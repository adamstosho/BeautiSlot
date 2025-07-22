const reviewService = require('../services/review.service');

exports.createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.user._id, req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Review failed' });
  }
}; 