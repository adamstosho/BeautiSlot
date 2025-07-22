const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  durationMins: { type: Number, required: true },
}, { timestamps: true });

serviceSchema.set('toJSON', {
  virtuals: true,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Service', serviceSchema); 