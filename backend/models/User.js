const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const portfolioSchema = new mongoose.Schema({
  imageUrl: String,
  caption: String,
  uploadedAt: { type: Date, default: Date.now },
});

const socialLinksSchema = new mongoose.Schema({
  instagram: String,
  whatsapp: String,
  facebook: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['provider', 'client'], required: true },
  phone: String,
  avatarUrl: String,
  bio: String,
  location: String,
  categories: [String],
  experienceYears: Number,
  portfolio: [portfolioSchema],
  socialLinks: socialLinksSchema,
  ratingsAverage: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.set('toJSON', {
  virtuals: true,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
    // Don't send password hash or reset tokens to client
    delete returnedObject.passwordHash;
    delete returnedObject.resetPasswordToken;
    delete returnedObject.resetPasswordExpires;
  },
});

module.exports = mongoose.model('User', userSchema); 