const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  city: { type: String },
  profilePhoto: { type: String },
  specializations: [{ type: String }],
  certifications: [{
    name: { type: String },
    verified: { type: Boolean, default: false },
    url: { type: String }
  }],
  experience: { type: String },
  bio: { type: String },
  status: { type: String, enum: ['pending', 'verified', 'blocked'], default: 'pending' },
  rating: { type: Number, default: 0 },
  reviews: [{
    reviewer: { type: String },
    text: { type: String },
    rating: { type: Number }
  }],
  clientCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
