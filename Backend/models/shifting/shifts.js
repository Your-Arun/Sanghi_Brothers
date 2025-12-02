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





// Assuming this file is in a 'controllers' folder and models are in 'models' folder
const Member = require('./Members'); 
const MapSnapshot = require('./MapSnapshot');
const cloudinary = require('cloudinary').v2;
const Settings = require('./Settings');
const restartScheduler = require('./smsBot');
require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
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
   
    const avatarUrl = req.file ? req.file.path : null;

    const newMember = new Member({
      name: req.body.name,
      role: req.body.role,
      shift: req.body.shift,
      available: req.body.available,
      phoneNumber:req.body.phoneNumber,
      avatar: avatarUrl, // <--- Cloudinary URL
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
      const { name, role, shift, available ,phoneNumber} = req.body;
    let updateData = {
      name,
      role,
      phoneNumber,
      shift,
      available
    };
    if (req.file) {
      updateData.avatar = req.file.path; 
    } const updatedMember = await Member.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    return res.json(updatedMember);
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


// --- SAVE MAP CONTROLLER ---
exports.saveMap = async (req, res) => {
  try {

    const { date, shift, image, caption ,assignments} = req.body;

    // Validation
    if (!date || !shift || !image) {
        return res.status(400).json({ message: 'Date, shift, and image are required' });
    }

    console.log("⏳ Uploading Map to Cloudinary...");

    // 2. Cloudinary Upload (Base64 JPEG handle kar lega)
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "pump_shift_maps", // Cloudinary folder name
      resource_type: "image"
    });

    console.log("✅ Uploaded to Cloudinary:", uploadResponse.secure_url);

    // 3. Database Update (Sirf URL save karenge)
    // findOneAndUpdate ka matlab: Agar date+shift ka map pehle se hai to update karo, nahi to naya banao (upsert).
    const updated = await MapSnapshot.findOneAndUpdate(
      { date, shift },
      { 
        image: uploadResponse.secure_url, // URL saved
        caption: caption || '',
        assignments: assignments || {} // 👈 DATA SAVE KIYA
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: 'Map saved successfully', snapshot: updated });

  } catch (err) {
    console.error("❌ Save Map Error:", err);
    return res.status(500).json({ message: 'Failed to save map', error: err.message });
  }
};

// --- GET MAP CONTROLLER (Ye URL return karega) ---
exports.getMap = async (req, res) => {
  try {
    const { date, shift } = req.query;
    if (!date || !shift) {
        return res.status(400).json({ message: 'Date and shift required' });
    }

    const snap = await MapSnapshot.findOne({ date, shift });
    
    if (!snap) {
        return res.json({ message: 'No map found', image: null });
    }

    return res.json({ 
        image: snap.image, // Cloudinary URL
        caption: snap.caption, 
        date: snap.date, 
        shift: snap.shift
    });

  } catch (err) {
    console.error("Get Map Error:", err);
    return res.status(500).json({ message: 'Failed to fetch map' });
  }
};

exports.getAllMaps = async (req, res) => {
  try {
    const maps = await MapSnapshot.find().sort({ createdAt: -1 });
    return res.json({ success: true, maps });
  } catch (err) {
    console.error("Get All Maps Error:", err);
    return res.status(500).json({ message: 'Failed to fetch maps' });
  }
};

// Delete Map (For History Page)
exports.deleteMap = async (req, res) => {
  try {
    const { id } = req.params;
    await MapSnapshot.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Map deleted successfully' });
  } catch (err) {
    console.error("Delete Map Error:", err);
    return res.status(500).json({ message: 'Failed to delete map' });
  }
};

exports.getSettings = async (req, res) => {
  try {
      let settings = await Settings.findOne();
      if (!settings) {
          settings = await Settings.create({});
      }
      res.json(settings);
  } catch (err) {
      console.error("Get Settings Error:", err);
      res.status(500).json({ message: "Failed to load settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
      const { morningTime, eveningTime } = req.body;
      
      // Update DB
      const settings = await Settings.findOneAndUpdate({}, 
          { morningTime, eveningTime }, 
          { new: true, upsert: true }
      );

      // Restart Scheduler
      if (typeof restartScheduler === 'function') {
          await restartScheduler(); 
      } else {
          console.warn("Scheduler restart function not found!");
      }

      res.json({ success: true, settings });
  } catch (error) {
      console.error("Update Settings Error:", error);
      res.status(500).json({ message: "Failed to update settings" });
  }
};


// 👇 TEST SMS CONTROLLER 👇
exports.testSms = async (req, res) => {
  try {
      const { shift } = req.body; // 'Morning' ya 'Evening'
      console.log(`🚀 Testing SMS for ${shift}...`);
      
      // Function call karein
      await sendShiftReport(shift);
      
      res.json({ success: true, message: "SMS Process Triggered! Check Server Logs." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};