const express = require("express");
const router = express.Router();


// Middleware to extract user department from token


// Fetch all reports for a specific department
router.get("/", async (req, res) => {
  const { department } = req.query;

  if (!department) {
    return res.status(400).json({ message: "Department is required." });
  }

  try {
    const userDepartment = getUserDepartment(req);
    if (userDepartment !== department) {
      return res.status(403).json({ message: "Access denied to this department's reports." });
    }

    const dept = await Department.findOne({ name: department });
    if (!dept) {
      return res.status(404).json({ message: "Department not found." });
    }

    const reports = await Report.find({ department: dept._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports." });
  }
});
