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






// controllers/shifts.js
// Assuming this file is in a 'controllers' folder and models are in 'models' folder
const Member = require('./Members'); 
const MapSnapshot = require('./MapSnapshot');

// --- MEMBER CONTROLLERS ---

exports.listMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    return res.json(members);
  } catch (err) {
    console.error("List Members Error:", err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { name, role, shift, available } = req.body;

    // Handle file upload (Cloudinary provides 'path')
    const avatarUrl = req.file ? req.file.path : null;

    const member = new Member({
      name,
      role: role || "operator",
      shift: shift || "morning",
      available: available || "present",
      avatar: avatarUrl,
    });

    const saved = await member.save();
    return res.json(saved);

  } catch (err) {
    console.error("Add Member Error:", err);
    return res.status(500).json({ message: "Failed to add member" });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await Member.findByIdAndDelete(id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error("Delete Member Error:", err);
    return res.status(500).json({ message: 'Failed to delete' });
  }
};

// --- MAP SNAPSHOT CONTROLLERS ---

exports.getMap = async (req, res) => {
  try {
    const { date, shift } = req.query;
    
    if (!date || !shift) {
        return res.status(400).json({ message: 'Date and shift are required' });
    }

    const snap = await MapSnapshot.findOne({ date, shift });
    
    if (!snap) {
        return res.json({ message: 'No map found', image: null });
    }

    return res.json({ 
        image: snap.image, 
        caption: snap.caption, 
        date: snap.date, 
        shift: snap.shift, 
        createdAt: snap.createdAt 
    });

  } catch (err) {
    console.error("Get Map Error:", err);
    return res.status(500).json({ message: 'Failed to fetch map' });
  }
};

exports.saveMap = async (req, res) => {
  try {
    const { date, shift, image, caption } = req.body;

    if (!date || !shift || !image) {
        return res.status(400).json({ message: 'Date, shift, and image are required' });
    }

    // Upsert: Find existing map for this date/shift and update it, or create new
    const updated = await MapSnapshot.findOneAndUpdate(
      { date, shift },
      { 
        image, 
        caption: caption || '', 
        // Don't override createdAt on update, Mongoose handles updatedAt
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: 'Map saved successfully', snapshot: updated });

  } catch (err) {
    console.error("Save Map Error:", err);
    return res.status(500).json({ message: 'Failed to save map' });
  }
};