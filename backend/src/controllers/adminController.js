const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { sendSetupEmail } = require('../utils/emailService');

// Create Admin (Super Admin only)
exports.createAdmin = async (req, res) => {
  try {
    const { fullName, email, phone, adminType, status, assignedCities } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    // Generate setup token
    const setupToken = crypto.randomBytes(32).toString('hex');
    const setupTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create admin
    const admin = new Admin({
      fullName,
      email: email.toLowerCase(),
      phone,
      adminType,
      status: status || 'Active',
      assignedCities: assignedCities || [],
      setupToken,
      setupTokenExpiry,
      passwordSet: false,
      emailVerified: false,
      // createdBy: req.user._id // Assuming req.user is set by auth middleware
    });

    await admin.save();

    // Send email (don't await to avoid blocking response, or await if you want to ensure it sent)
    const emailSent = await sendSetupEmail(admin.email, admin.fullName, setupToken);

    if (!emailSent) {
      console.warn('Admin created but email failed to send');
    }

    res.status(201).json({
      success: true,
      message: 'Admin created successfully. Setup email sent.',
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        adminType: admin.adminType,
        status: admin.status
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create admin.', error: error.message });
  }
};

// Get All Admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password -setupToken').sort({ createdAt: -1 });
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admins.', error: error.message });
  }
};

// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { fullName, phone, adminType, status } = req.body;
    const adminId = req.params.adminId;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { fullName, phone, adminType, status },
      { new: true, runValidators: true }
    ).select('-password -setupToken');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    res.status(200).json({ success: true, message: 'Admin updated successfully', admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update admin.', error: error.message });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const admin = await Admin.findByIdAndDelete(adminId);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    res.status(200).json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete admin.', error: error.message });
  }
};

// Setup Password (Public)
exports.setupPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Find admin by token and check expiry
    const admin = await Admin.findOne({
      setupToken: token,
      setupTokenExpiry: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid or expired setup link.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update admin
    admin.password = hashedPassword;
    admin.passwordSet = true;
    admin.emailVerified = true;
    admin.setupToken = undefined;
    admin.setupTokenExpiry = undefined;

    await admin.save();

    res.status(200).json({ success: true, message: 'Password set successfully.' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to setup password.', error: error.message });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    let userToLogin = admin;
    let isSuperAdmin = false;

    if (!admin) {
      // Try to find Super Admin in User model
      const User = require('../models/User');
      const superAdmin = await User.findOne({ email: email.toLowerCase(), role: 'superadmin' });
      
      if (!superAdmin) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
      userToLogin = superAdmin;
      isSuperAdmin = true;
    } else {
      if (!admin.passwordSet) {
        return res.status(401).json({ success: false, message: 'Please setup your password first.' });
      }

      if (admin.status !== 'Active') {
        return res.status(403).json({ success: false, message: 'Account is not active. Please contact super admin.' });
      }
    }

    const isMatch = await bcrypt.compare(password, userToLogin.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        id: userToLogin._id, 
        email: userToLogin.email, 
        role: isSuperAdmin ? 'Super Admin' : userToLogin.adminType 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: userToLogin._id,
        fullName: isSuperAdmin ? userToLogin.name : userToLogin.fullName,
        email: userToLogin.email,
        adminType: isSuperAdmin ? 'Super Admin' : userToLogin.adminType
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
};
