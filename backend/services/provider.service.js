const User = require('../models/User');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.getProfile = async (userId) => {
  return await User.findById(userId).select('-passwordHash');
};

exports.updateProfile = async (userId, data) => {
  const allowed = [
    'name', 'email', 'phone', 'avatarUrl', 'bio', 'location',
    'categories', 'experienceYears', 'socialLinks'
  ];
  const update = {};
  for (const key of allowed) {
    if (data[key] !== undefined) update[key] = data[key];
  }
  return await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).select('-passwordHash');
};

exports.deleteProfile = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

exports.createService = async (userId, data) => {
  const service = new Service({ ...data, providerId: userId });
  return await service.save();
};

exports.updateService = async (userId, serviceId, data) => {
  const service = await Service.findOneAndUpdate(
    { _id: serviceId, providerId: userId },
    data,
    { new: true, runValidators: true }
  );
  return service;
};

exports.deleteService = async (userId, serviceId) => {
  return await Service.findOneAndDelete({ _id: serviceId, providerId: userId });
};

exports.listServices = async (userId) => {
  return await Service.find({ providerId: userId });
};

exports.setAvailability = async (userId, data) => {
  // Capitalize the first letter of dayOfWeek to ensure consistent storage
  const dayOfWeek = data.dayOfWeek.charAt(0).toUpperCase() + data.dayOfWeek.slice(1).toLowerCase();

  const availabilityData = {
    ...data,
    providerId: userId,
    dayOfWeek: dayOfWeek,
  };

  const availability = new Availability(availabilityData);
  return await availability.save();
};

exports.updateAvailability = async (userId, availabilityId, data) => {
  // Also ensure consistency on update
  if (data.dayOfWeek) {
    data.dayOfWeek = data.dayOfWeek.charAt(0).toUpperCase() + data.dayOfWeek.slice(1).toLowerCase();
  }

  const availability = await Availability.findOneAndUpdate(
    { _id: availabilityId, providerId: userId },
    data,
    { new: true, runValidators: true }
  );
  return availability;
};

exports.deleteAvailability = async (userId, availabilityId) => {
  return await Availability.findOneAndDelete({ _id: availabilityId, providerId: userId });
};

exports.getAvailability = async (userId) => {
  return await Availability.find({ providerId: userId });
};

exports.uploadPortfolio = async (userId, file, caption) => {
  if (!file) throw new Error('No file provided');
  // Upload to Cloudinary using a Promise and streamifier
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
      if (error) return reject(error);
      // Add to user's portfolio
      const portfolioItem = {
        imageUrl: result.secure_url,
        caption,
        uploadedAt: new Date(),
      };
      await User.findByIdAndUpdate(userId, { $push: { portfolio: portfolioItem } });
      resolve(portfolioItem);
    });
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
  return result;
};

exports.removePortfolio = async (userId, portfolioId) => {
  // Find user and portfolio item
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const item = user.portfolio.id(portfolioId);
  if (!item) throw new Error('Portfolio item not found');
  // Remove from Cloudinary (extract public_id from URL)
  const publicId = item.imageUrl.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(publicId);
  // Remove from user's portfolio
  await User.findByIdAndUpdate(userId, { $pull: { portfolio: { _id: portfolioId } } });
  return true;
}; 