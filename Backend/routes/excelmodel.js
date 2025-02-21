const mongoose = require("mongoose");

const ExcelFileSchema = new mongoose.Schema({
  filename: String,
  fileData: Buffer,
});

module.exports = mongoose.model("ExcelFile", ExcelFileSchema);
