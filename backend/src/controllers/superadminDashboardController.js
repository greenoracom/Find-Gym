const User = require('../models/User');
const Gym = require('../models/Gym');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'member' });
    const totalGyms = await Gym.countDocuments();
    
    // Mocking revenue and bookings for now as models don't exist yet
    const totalRevenue = 450000;
    const activeBookings = 85;

    res.json({
      totalUsers,
      totalGyms,
      totalRevenue,
      activeBookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
