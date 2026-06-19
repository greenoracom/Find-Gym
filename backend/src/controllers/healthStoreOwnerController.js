const HealthStore = require('../models/HealthStore');
const HealthStoreProduct = require('../models/HealthStoreProduct');
const HealthStoreOrder = require('../models/HealthStoreOrder');

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const storeId = req.healthStore._id;

    const [
      totalProducts,
      liveProducts,
      pendingProducts,
      draftProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
    ] = await Promise.all([
      HealthStoreProduct.countDocuments({ healthStore: storeId }),
      HealthStoreProduct.countDocuments({ healthStore: storeId, isLive: true }),
      HealthStoreProduct.countDocuments({ healthStore: storeId, approvalStatus: 'Pending Approval' }),
      HealthStoreProduct.countDocuments({ healthStore: storeId, approvalStatus: 'Draft' }),
      HealthStoreOrder.countDocuments({ healthStore: storeId }),
      HealthStoreOrder.countDocuments({ healthStore: storeId, orderStatus: 'Pending' }),
      HealthStoreOrder.countDocuments({ healthStore: storeId, orderStatus: 'Delivered' }),
    ]);

    // Revenue (paid orders only)
    const revenueAgg = await HealthStoreOrder.aggregate([
      { $match: { healthStore: storeId, paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Low stock products
    const lowStockProducts = await HealthStoreProduct.countDocuments({
      healthStore: storeId,
      productType: 'Supplement',
      $expr: { $lte: ['$stock', '$lowStockAlert'] },
    });

    // Recent orders
    const recentOrders = await HealthStoreOrder.find({ healthStore: storeId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name email');

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          liveProducts,
          pendingProducts,
          draftProducts,
          totalOrders,
          pendingOrders,
          deliveredOrders,
          totalRevenue,
          lowStockProducts,
        },
        recentOrders,
      },
    });
  } catch (err) {
    console.error('HS Owner Dashboard Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── STORE PROFILE ───────────────────────────────────────────────────────────
exports.getStoreProfile = async (req, res) => {
  try {
    const store = await HealthStore.findById(req.healthStore._id);
    res.json({ success: true, data: store });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateStoreProfile = async (req, res) => {
  try {
    const allowedFields = [
      'storeName', 'description', 'openingTime', 'closingTime',
      'deliveryAvailable', 'deliveryRadiusKm', 'serviceAreas',
      'bankDetails',
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // Handle uploaded logo/banner
    const files = req.uploadedFiles || {};
    if (files.logo) updates.logo = files.logo;
    if (files.bannerImage) updates.bannerImage = files.bannerImage;

    const store = await HealthStore.findByIdAndUpdate(req.healthStore._id, updates, { new: true });
    res.json({ success: true, message: 'Profile updated', data: store });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── ADD PRODUCT ─────────────────────────────────────────────────────────────
exports.addProduct = async (req, res) => {
  try {
    const {
      productType, name, category, brand,
      shortDescription, description, benefits, suitableFor,
      ingredients, howToUse, duration, foodPreference, quantity,
      originalPrice, sellingPrice, oneTimePrice, monthlyPrice,
      stock, lowStockAlert, flavor, isReturnable, deliveryAvailable,
      calories, protein, carbs, fat,
      mealChart, expiryDate,
      submitForApproval,
    } = req.body;

    if (!productType || !name || !category) {
      return res.status(400).json({ success: false, message: 'productType, name, and category are required' });
    }

    const files = req.uploadedFiles || {};
    const images = files.images
      ? (Array.isArray(files.images) ? files.images : [files.images])
      : [];

    const product = await HealthStoreProduct.create({
      healthStore: req.healthStore._id,
      owner: req.storeOwner._id,
      city: req.healthStore.city,
      productType,
      name,
      category,
      brand,
      shortDescription,
      description,
      benefits: benefits ? (Array.isArray(benefits) ? benefits : benefits.split('\n')) : [],
      suitableFor: suitableFor ? (Array.isArray(suitableFor) ? suitableFor : suitableFor.split('\n')) : [],
      ingredients,
      howToUse,
      duration: duration || 'N/A',
      foodPreference: foodPreference || 'N/A',
      quantity,
      originalPrice: originalPrice ? parseFloat(originalPrice) : 0,
      sellingPrice: sellingPrice ? parseFloat(sellingPrice) : 0,
      oneTimePrice: oneTimePrice ? parseFloat(oneTimePrice) : 0,
      monthlyPrice: monthlyPrice ? parseFloat(monthlyPrice) : 0,
      stock: stock ? parseInt(stock) : 0,
      lowStockAlert: lowStockAlert ? parseInt(lowStockAlert) : 10,
      nutritionInfo: { calories: calories ? parseInt(calories) : 0, protein, carbs, fat },
      flavor,
      isReturnable: isReturnable === 'true' || isReturnable === true,
      deliveryAvailable: deliveryAvailable !== 'false' && deliveryAvailable !== false,
      images,
      mealChart,
      pdfFile: files.pdfFile || undefined,
      expiryDate: expiryDate || undefined,
      approvalStatus: (submitForApproval === 'true' || submitForApproval === true) ? 'Pending Approval' : 'Draft',
    });

    res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (err) {
    console.error('Add Product Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── GET PRODUCTS ─────────────────────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 10 } = req.query;
    const filter = { healthStore: req.healthStore._id };

    if (type) filter.productType = type;
    if (status) filter.approvalStatus = status;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      HealthStoreProduct.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      HealthStoreProduct.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── GET PRODUCT BY ID ────────────────────────────────────────────────────────
exports.getProductById = async (req, res) => {
  try {
    const product = await HealthStoreProduct.findOne({
      _id: req.params.id,
      healthStore: req.healthStore._id,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── UPDATE PRODUCT ───────────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await HealthStoreProduct.findOne({
      _id: req.params.id,
      healthStore: req.healthStore._id,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (!['Draft', 'Rejected'].includes(product.approvalStatus)) {
      return res.status(400).json({ success: false, message: 'Only Draft or Rejected products can be edited.' });
    }

    const files = req.uploadedFiles || {};
    const updateFields = { ...req.body };
    if (files.images) {
      updateFields.images = Array.isArray(files.images) ? files.images : [files.images];
    }
    if (files.pdfFile) updateFields.pdfFile = files.pdfFile;

    Object.assign(product, updateFields);
    await product.save();

    res.json({ success: true, message: 'Product updated', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── DELETE PRODUCT ───────────────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await HealthStoreProduct.findOne({
      _id: req.params.id,
      healthStore: req.healthStore._id,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.approvalStatus !== 'Draft') {
      return res.status(400).json({ success: false, message: 'Only Draft products can be deleted.' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── SUBMIT FOR APPROVAL ─────────────────────────────────────────────────────
exports.submitForApproval = async (req, res) => {
  try {
    const product = await HealthStoreProduct.findOne({
      _id: req.params.id,
      healthStore: req.healthStore._id,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (!['Draft', 'Rejected'].includes(product.approvalStatus)) {
      return res.status(400).json({ success: false, message: 'Product already submitted or live.' });
    }

    product.approvalStatus = 'Pending Approval';
    product.rejectionReason = undefined;
    await product.save();

    res.json({ success: true, message: 'Product submitted for approval', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── GET ORDERS ───────────────────────────────────────────────────────────────
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { healthStore: req.healthStore._id };
    if (status) filter.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      HealthStoreOrder.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('customer', 'name email phone'),
      HealthStoreOrder.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── UPDATE ORDER STATUS ─────────────────────────────────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await HealthStoreOrder.findOne({
      _id: req.params.id,
      healthStore: req.healthStore._id,
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    await order.save();

    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
