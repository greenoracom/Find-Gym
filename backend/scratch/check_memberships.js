const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../src/config/db');

const check = async () => {
  await connectDB();
  const ids = ["6a3e09bd67fb876a4775c821", "6a3e1e6f9e91a7ce3510d7b8"];
  for (const id of ids) {
    const webUser = await mongoose.connection.db.collection('Website User').findOne({ _id: new mongoose.Types.ObjectId(id) });
    const mobUser = await mongoose.connection.db.collection('Mobile User').findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (webUser) console.log("WebUser role:", webUser.role);
    if (mobUser) console.log("MobUser role:", mobUser.role);
  }
  process.exit(0);
};

check();
