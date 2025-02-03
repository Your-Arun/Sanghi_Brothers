const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the report
    content: { type: String, required: true }, // Content of the report
    department: { type: String, required: true }, // Department associated with the report
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User who created the report
      required: true,
    },
    createdAt: { type: Date, default: Date.now }, // To track when the report is created
  });
  
  module.exports = mongoose.model("Report", reportSchema);
