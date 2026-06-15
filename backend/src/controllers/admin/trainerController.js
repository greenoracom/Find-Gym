const Trainer = require('../../models/Trainer');
const ActivityLog = require('../../models/ActivityLog');

exports.getAllTrainers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    if (req.query.specialization) {
      query.specializations = { $in: [new RegExp(req.query.specialization, 'i')] };
    }

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    let sort = {};
    sort[sortField] = sortOrder;

    const trainers = await Trainer.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalCount = await Trainer.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        trainers: trainers.map(t => ({
          id: t._id,
          name: t.name,
          email: t.email,
          specialization: t.specializations.join(', '),
          status: t.status,
          rating: t.rating,
          clientCount: t.clientCount
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getTrainerDetails = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    
    res.status(200).json({
      success: true,
      data: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        profilePhoto: trainer.profilePhoto,
        specializations: trainer.specializations,
        certifications: trainer.certifications,
        experience: trainer.experience,
        bio: trainer.bio,
        status: trainer.status,
        rating: trainer.rating,
        reviews: trainer.reviews,
        clientCount: trainer.clientCount,
        createdAt: trainer.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.approveTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.trainerId, 
      { status: 'verified' }, 
      { new: true }
    );
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    await ActivityLog.create({
      type: 'trainer_approved',
      adminId: req.admin._id,
      description: `Trainer ${trainer.name} was approved.`
    });

    res.status(200).json({ success: true, message: 'Trainer approved', trainer: { id: trainer._id, status: 'verified' } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.rejectTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.trainerId, 
      { status: 'blocked' }, // Assuming rejected acts as blocked or there is a specific rejected status. Specification says "status changes to blocked" or similar.
      { new: true }
    );
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    await ActivityLog.create({
      type: 'trainer_rejected',
      adminId: req.admin._id,
      description: `Trainer ${trainer.name} was rejected. Reason: ${req.body.reason || 'None provided'}`
    });

    res.status(200).json({ success: true, message: 'Trainer rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.blockTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.trainerId, 
      { status: 'blocked' }, 
      { new: true }
    );
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    await ActivityLog.create({
      type: 'trainer_blocked',
      adminId: req.admin._id,
      description: `Trainer ${trainer.name} was blocked.`
    });

    res.status(200).json({ success: true, message: 'Trainer blocked' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.unblockTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.trainerId, 
      { status: 'verified' }, 
      { new: true }
    );
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    await ActivityLog.create({
      type: 'trainer_unblocked',
      adminId: req.admin._id,
      description: `Trainer ${trainer.name} was unblocked.`
    });

    res.status(200).json({ success: true, message: 'Trainer unblocked' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.trainerId);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    await ActivityLog.create({
      type: 'trainer_deleted',
      adminId: req.admin._id,
      description: `Trainer ${trainer.name} was deleted.`
    });

    res.status(200).json({ success: true, message: 'Trainer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
