require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const createSuperAdmin = require("./utils/createSuperAdmin");

const startServer = async () => {
  try {
    await connectDB();

    // Default Super Admin create karega
    await createSuperAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();