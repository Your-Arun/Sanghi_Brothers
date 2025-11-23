// models/MapSnapshot.js
const mongoose = require('mongoose');

const MapSnapshotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  shift: { type: String, required: true }, // Morning/Evening
  image: { type: String, required: true }, // Base64 string or URL
  caption: { type: String, default: "" },
}, {
  timestamps: true
});

// Compound index to ensure unique map per date+shift
MapSnapshotSchema.index({ date: 1, shift: 1 }, { unique: true });

module.exports = mongoose.model('MapSnapshot', MapSnapshotSchema);