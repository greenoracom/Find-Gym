const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  members: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Approved', 'Suspended', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gym', gymSchema);
