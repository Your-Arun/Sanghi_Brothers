const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    phone: { type: String,  required: true, trim: true },
    password: { type: String, required: true },
    department: { type: String, trim: true },
    otp: { type: String },
    otpExpires: { type: Date }, // ✅ Make sure this is defined
    picture:  { type: String },
    address:  { type: String },
    aadhaar: { type: String, trim: true },
    designation:  { type: String },
    joiningDate:  { type: Date },
    salary:  { type: Number },
    photo:  { type: String },// Base64 or URL
    authType: { type: String, default: "google" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

