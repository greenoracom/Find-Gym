const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  city: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String },
  membersCount: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  monthlyRevenue: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'suspended', 'rejected'], default: 'pending' },
  equipment: [{ type: String }],
  classes: [{
    name: { type: String },
    timings: { type: String },
    trainer: { type: String }
  }],
  rating: { type: Number, default: 0 },
  documents: [{
    type: { type: String },
    verified: { type: Boolean, default: false },
    url: { type: String }
  }],
  totalBookings: { type: Number, default: 0 },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  suspendedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Gym', gymSchema);
