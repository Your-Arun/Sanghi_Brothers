// models/MapSnapshot.js
const mongoose = require('mongoose');

const MapSnapshotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // store as YYYY-MM-DD
  shift: { type: String, required: true }, // Morning / Evening or whatever
  image: { type: String, required: true }, // base64 dataURL
  caption: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// ensure one snapshot per date+shift (unique)
MapSnapshotSchema.index({ date: 1, shift: 1 }, { unique: true });

module.exports = mongoose.model('MapSnapshot', MapSnapshotSchema);
