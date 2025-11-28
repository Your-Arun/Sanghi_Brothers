// const mongoose = require("mongoose");
// const memberSchema = new mongoose.Schema({
//   name: String,
//   role: String,
//   shift: String,
//   available: String,
// });
// const Member = mongoose.model("Member", memberSchema);
// module.exports = Member;



// models/Member.js
const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: 'operator' },        // operator, supervisor, air boy etc.
  shift: { type: String, default: 'morning' },        // morning/evening
  available: { type: String, default: 'present' },    // present/absent
  avatar: { type: String, default: null },            // URL or base64 data
  phoneNumber: { type: String, required: true } 
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', MemberSchema);
