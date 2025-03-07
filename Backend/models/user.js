const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  tokens: [{ token: String }], // Multiple tokens maintain karne ke liye array
});

  
  module.exports  = mongoose.model("User", UserSchema);