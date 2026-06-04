const express = require("express");
const cors = require("cors");
const superadminDashboardRoutes = require('./routes/superadminDashboardRoutes');
const superadminUserRoutes = require('./routes/superadminUserRoutes');
const superadminAdminRoutes = require('./routes/superadminAdminRoutes');
const superadminGymRoutes = require('./routes/superadminGymRoutes');
const superadminCmsRoutes = require('./routes/superadminCmsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files for CMS
const path = require('path');
app.use('/cms', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
  res.send("Find Gym API Running...");
});

// Super Admin Routes
app.use('/api/superadmin/dashboard', superadminDashboardRoutes);
app.use('/api/superadmin/users', superadminUserRoutes);
app.use('/api/superadmin/admins', superadminAdminRoutes);
app.use('/api/superadmin/gyms', superadminGymRoutes);
app.use('/api/superadmin/cms', superadminCmsRoutes);

module.exports = app;