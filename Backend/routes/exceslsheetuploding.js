const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const router = express.Router();

// MongoDB Connection (Already connected in your app)
const conn = mongoose.connection;

const getGridFSBucket = () => {
    return new GridFSBucket(mongoose.connection.db, { bucketName: 'excelFiles' });
  };
  
  const getGfsFilesCollection = () => {
    return mongoose.connection.db.collection('excelFiles.files');
  };
  

// Multer Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 **Route: Save Excel File to Database (GridFS)**
router.post('/exceluploader', upload.single('excelFile'), async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: '❌ No file uploaded or buffer missing' });
      }
  
      const gridFSBucket = getGridFSBucket();
  
      const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });
  
      uploadStream.end(req.file.buffer);
  
      uploadStream.on('finish', () => {
        res.status(200).json({ message: '✅ File saved successfully!', filename: req.file.originalname });
      });
  
    } catch (error) {
      console.error('❌ Upload error:', error);
      res.status(500).json({ message: '❌ Error saving file' });
    }
  });
  

// 📌 **Route: Download File**
router.get('/exceluploader/:filename', async (req, res) => {
    try {
      const gfs = getGfsFilesCollection();
      const gridFSBucket = getGridFSBucket();
  
      const files = await gfs.find({ filename: req.params.filename }).toArray();
      if (!files || files.length === 0) return res.status(404).json({ message: '❌ File not found' });
  
      const file = files[0];
      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
  
      const downloadStream = gridFSBucket.openDownloadStream(file._id);
      downloadStream.pipe(res);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ message: '❌ Error downloading file' });
    }
  });
  


// 📌 **Route: Get List of Saved Excel Files**
router.get('/exceluploader', async (req, res) => {
    try {
      const gfs = getGfsFilesCollection();
      const files = await gfs.find().toArray();
      if (!files || files.length === 0) {
        return res.json([]);
      }
      res.json(files);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ message: '❌ Error fetching files' });
    }
  });
  

// ✅ Delete File
// ✅ Delete File
router.delete("/exceluploader/:filename", async (req, res) => {
  try {
    const gfs = getGfsFilesCollection();
    const gridFSBucket = getGridFSBucket();

    // Check if file exists
    const file = await gfs.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: "❌ File not found" });
    }

    // Delete file from GridFS
    await gridFSBucket.delete(file._id);

    res.json({ message: "✅ File deleted successfully!" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "❌ Error deleting file" });
  }
});


module.exports = router;
