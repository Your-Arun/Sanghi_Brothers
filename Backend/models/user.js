const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    department: { type: String, trim: true },
    otp: { type: String },
    otpExpires: { type: Date },

    // ✅ सिर्फ एक field रखी है photo (base64 / URL के लिए)
    photo: { type: String },  

    address: { type: String },
    aadhaar: { type: String, trim: true, minlength: 12, maxlength: 12 },
    designation: { type: String },
    joiningDate: { type: Date },
    salary: { type: Number },

    authType: { type: String, enum: ["local", "google"], default: "local" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
