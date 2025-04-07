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
    picture: String,
    authType: { type: String, default: "google" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
