const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  department: String,
  tokens: [{ token: String, createdAt: { type: Date, default: Date.now } }], // ✅ Multiple tokens
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);