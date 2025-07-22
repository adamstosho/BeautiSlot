const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  startTime: String,
  endTime: String,
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dayOfWeek: { type: String, required: true },
  slots: [slotSchema],
}, { timestamps: true });

availabilitySchema.set('toJSON', {
  virtuals: true,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Availability', availabilitySchema); 