// const mongoose = require("mongoose");

// const NozzleSchema = new mongoose.Schema({
//   nozzleNumber: { type: String, required: true },
//   member: { type: String, default: "Unassigned" },
//   overtime: { type: Boolean, default: false },
// });

// const ShiftSchema = new mongoose.Schema({
//   date: { type: String, required: true },
//   shiftType: { type: String, enum: ["Morning Shift", "Evening Shift"], required: true },
//   startTime: { type: String, required: true },
//   endTime: { type: String, required: true },
//   supervisor: { type: String, default: "Not Assigned" },
//   airBoy: { type: String, default: "Not Assigned" },
//   extraOperator: { type: String,default: "Not Assigned"  },
//   nozzles: [NozzleSchema], // Array of nozzle objects
// });

// // Middleware to standardize date format before saving
// ShiftSchema.pre("save", function (next) {
//   if (this.date instanceof Date) {
//     this.date = this.date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
//   }
//   next();
// });

// const Shift = mongoose.model("Shift", ShiftSchema);
// module.exports = Shift;

// controllers/shiftingController.js
const Member = require('./Members');
const MapSnapshot = require('./MapSnapshot');

exports.listMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    return res.json(members);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { name, role, shift, available, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const member = new Member({
      name,
      role: role || 'operator',
      shift: shift || 'morning',
      available: available || 'present',
      avatar: image || null
    });

    const saved = await member.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to add member' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await Member.findByIdAndDelete(id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete' });
  }
};

exports.getMap = async (req, res) => {
  try {
    const { date, shift } = req.query;
    if (!date || !shift) return res.status(400).json({ message: 'date and shift are required' });
    const snap = await MapSnapshot.findOne({ date, shift });
    if (!snap) return res.json({ message: 'No map', image: null });
    return res.json({ image: snap.image, caption: snap.caption, date: snap.date, shift: snap.shift, createdAt: snap.createdAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch map' });
  }
};

exports.saveMap = async (req, res) => {
  try {
    const { date, shift, image, caption } = req.body;
    if (!date || !shift || !image) return res.status(400).json({ message: 'date, shift and image are required' });

    // Upsert: replace existing snapshot for date+shift
    const updated = await MapSnapshot.findOneAndUpdate(
      { date, shift },
      { image, caption: caption || '', createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: 'Saved', snapshot: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save map' });
  }
};
