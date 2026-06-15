const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Gym = require('../models/Gym');
const Trainer = require('../models/Trainer');
const Dietitian = require('../models/Dietitian');
const ActivityLog = require('../models/ActivityLog');

// Helper to get authorized cities for query
const getAuthorizedCities = (admin, requestedCity) => {
  const isGlobalAdmin = ['Super Admin', 'Platform Admin'].includes(admin.adminType);
  if (isGlobalAdmin) {
    return requestedCity ? [requestedCity] : null;
  }
  const assigned = admin.assignedCities || [];
  if (requestedCity) {
    if (assigned.some(c => c.toLowerCase() === requestedCity.toLowerCase())) {
      return [requestedCity];
    }
    return []; // No access
  }
  return assigned;
};

// 1. Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const cities = getAuthorizedCities(req.admin, req.query.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    const query = cities ? { city: { $in: cities } } : {};
    
    // For users, the field is 'city'. Let's ensure User model has city.
    const userQuery = cities ? { city: { $in: cities }, role: 'member' } : { role: 'member' };

    const totalUsers = await User.countDocuments(userQuery);
    const totalGyms = await Gym.countDocuments(query);
    const pendingGyms = await Gym.countDocuments({ ...query, status: 'pending' });
    const verifiedTrainers = await Trainer.countDocuments({ ...query, status: 'verified' });
    const verifiedDietitians = await Dietitian.countDocuments({ ...query, status: 'verified' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalGyms,
        pendingGyms,
        verifiedTrainers,
        verifiedDietitians
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. All Users
exports.getAllUsers = async (req, res) => {
  try {
    const cities = getAuthorizedCities(req.admin, req.query.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    let query = { role: 'member' };
    if (cities) {
      query.city = { $in: cities };
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$and = [
        { $or: [{ name: regex }, { email: regex }] }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. All Gyms
exports.getAllGyms = async (req, res) => {
  try {
    const cities = getAuthorizedCities(req.admin, req.query.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    let query = {};
    if (cities) {
      query.city = { $in: cities };
    }

    if (req.query.search) {
      query.name = new RegExp(req.query.search, 'i');
    }

    const gyms = await Gym.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: gyms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Approve Gym
exports.approveGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.gymId);
    if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

    const cities = getAuthorizedCities(req.admin, gym.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    gym.status = 'approved';
    gym.approvedBy = req.admin._id;
    gym.approvedAt = new Date();
    await gym.save();

    await ActivityLog.create({
      type: 'gym_approved',
      adminId: req.admin._id,
      city: gym.city,
      description: `Gym "${gym.name}" approved in ${gym.city}`
    });

    res.status(200).json({ success: true, message: 'Gym approved successfully', data: gym });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Reject Gym
exports.rejectGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.gymId);
    if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

    const cities = getAuthorizedCities(req.admin, gym.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    gym.status = 'rejected';
    gym.rejectedAt = new Date();
    await gym.save();

    await ActivityLog.create({
      type: 'gym_rejected',
      adminId: req.admin._id,
      city: gym.city,
      description: `Gym "${gym.name}" rejected. Reason: ${req.body.reason || 'Not specified'}`
    });

    res.status(200).json({ success: true, message: 'Gym rejected successfully', data: gym });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Suspend Gym
exports.suspendGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.gymId);
    if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

    const cities = getAuthorizedCities(req.admin, gym.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    gym.status = 'suspended';
    gym.suspendedAt = new Date();
    await gym.save();

    await ActivityLog.create({
      type: 'gym_suspended',
      adminId: req.admin._id,
      city: gym.city,
      description: `Gym "${gym.name}" suspended`
    });

    res.status(200).json({ success: true, message: 'Gym suspended successfully', data: gym });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. All Trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const cities = getAuthorizedCities(req.admin, req.query.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    let query = {};
    if (cities) {
      query.city = { $in: cities };
    }

    if (req.query.search) {
      query.name = new RegExp(req.query.search, 'i');
    }

    const trainers = await Trainer.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Approve Trainer
exports.approveTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    const cities = getAuthorizedCities(req.admin, trainer.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    trainer.status = 'verified';
    await trainer.save();

    await ActivityLog.create({
      type: 'trainer_approved',
      adminId: req.admin._id,
      city: trainer.city,
      description: `Trainer "${trainer.name}" approved`
    });

    res.status(200).json({ success: true, message: 'Trainer approved successfully', data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Reject Trainer
exports.rejectTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    const cities = getAuthorizedCities(req.admin, trainer.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    trainer.status = 'blocked';
    await trainer.save();

    await ActivityLog.create({
      type: 'trainer_rejected',
      adminId: req.admin._id,
      city: trainer.city,
      description: `Trainer "${trainer.name}" rejected. Reason: ${req.body.reason || 'Not specified'}`
    });

    res.status(200).json({ success: true, message: 'Trainer rejected successfully', data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10. Block Trainer
exports.blockTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    const cities = getAuthorizedCities(req.admin, trainer.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    trainer.status = 'blocked';
    await trainer.save();

    await ActivityLog.create({
      type: 'trainer_blocked',
      adminId: req.admin._id,
      city: trainer.city,
      description: `Trainer "${trainer.name}" blocked`
    });

    res.status(200).json({ success: true, message: 'Trainer blocked successfully', data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 11. All Dietitians
exports.getAllDietitians = async (req, res) => {
  try {
    const cities = getAuthorizedCities(req.admin, req.query.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    let query = {};
    if (cities) {
      query.city = { $in: cities };
    }

    if (req.query.search) {
      query.name = new RegExp(req.query.search, 'i');
    }

    const dietitians = await Dietitian.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: dietitians });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 12. Approve Dietitian
exports.approveDietitian = async (req, res) => {
  try {
    const dietitian = await Dietitian.findById(req.params.dietitianId);
    if (!dietitian) return res.status(404).json({ success: false, message: 'Dietitian not found' });

    const cities = getAuthorizedCities(req.admin, dietitian.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    dietitian.status = 'verified';
    await dietitian.save();

    await ActivityLog.create({
      type: 'dietitian_approved',
      adminId: req.admin._id,
      city: dietitian.city,
      description: `Dietitian "${dietitian.name}" approved`
    });

    res.status(200).json({ success: true, message: 'Dietitian approved successfully', data: dietitian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 13. Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const cities = getAuthorizedCities(req.admin, req.query.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    const query = cities ? { city: { $in: cities } } : {};
    
    // Get growth data of users
    const users = await User.find(cities ? { city: { $in: cities }, role: 'member' } : { role: 'member' }).select('createdAt');
    const gyms = await Gym.find(query).select('createdAt');

    // Aggregate monthly registrations
    const getMonthlyData = (items) => {
      const counts = Array(12).fill(0);
      items.forEach(item => {
        if (item.createdAt) {
          const month = new Date(item.createdAt).getMonth();
          counts[month]++;
        }
      });
      return counts;
    };

    res.status(200).json({
      success: true,
      data: {
        userGrowth: getMonthlyData(users),
        gymGrowth: getMonthlyData(gyms)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 14. Activity Logs
exports.getActivityLogs = async (req, res) => {
  try {
    const cities = getAuthorizedCities(req.admin, req.query.city);
    if (cities && cities.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this city",
        code: "CITY_ACCESS_DENIED"
      });
    }

    let query = {};
    if (cities) {
      query.city = { $in: cities };
    }

    const logs = await ActivityLog.find(query)
      .populate('userId', 'name email')
      .populate('adminId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 15. Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { fullName, phone },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 16. Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
