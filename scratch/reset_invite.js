const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

const HealthStore = require('../backend/src/models/HealthStore');
const HealthStoreInvite = require('../backend/src/models/HealthStoreInvite');

async function reset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const token = '70634457dc29eb1fa89326c86e6e9b30df2cc4538657ace8936e658d2cdd7d27';
    
    // Reset invite
    const invite = await HealthStoreInvite.findOne({ inviteToken: token });
    if (invite) {
      invite.status = 'Invited';
      invite.inviteTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
      await invite.save();
      console.log("Invite status set to Invited");
    } else {
      console.log("Invite not found");
    }

    // Reset store
    if (invite) {
      const store = await HealthStore.findOne({ inviteRef: invite._id });
      if (store) {
        store.status = 'Invited';
        await store.save();
        console.log("Store status set to Invited");
      } else {
        console.log("Store not found");
      }
    }

    await mongoose.disconnect();
    console.log("Database connection closed. Reset complete!");
  } catch (err) {
    console.error("Error:", err);
  }
}

reset();
