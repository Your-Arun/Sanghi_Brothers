const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Member = mongoose.model("Member", {
  name: String,
  role: String,
  shift: String,
  available: String,
});

router.post("", async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("", async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("", async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(member);
  } catch (error) { 
    res.status(400).json({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Member deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {role, available } = req.body;
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, {   ...(role && { role }),  available }, { new: true });
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: "Error updating availability", error });
  }
});

module.exports = router;