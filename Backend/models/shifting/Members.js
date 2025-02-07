const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  role: String,
  shift: String,
  available: String,
  overtime: String,
});


const Member = mongoose.model("Member", memberSchema);

module.exports = Member;