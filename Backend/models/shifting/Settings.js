const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  morningTime: { type: String, default: "05:00" }, // Format: HH:mm (24hr)
  eveningTime: { type: String, default: "14:00" }
});

// Hum hamesha ek hi ID (settings_id) use karenge taaki update aasan ho
module.exports = mongoose.model('Settings', settingsSchema);