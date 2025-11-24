const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// 1. Dotenv ko yahan load karein taaki keys mil sakein
require('dotenv').config(); 

// 2. Debugging: Check karein ki Keys aa rahi hain ya nahi
// (Terminal me server start hone par ye print hoga)
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("❌ CLOUDINARY CONFIG ERROR: .env file se keys nahi mil rahi hain!");
  console.error("Check karein ki aapne .env file banayi hai aur usme spelling sahi hai.");
} else {
  console.log("✅ Cloudinary Config Loaded for:", process.env.CLOUD_NAME);
}

// 3. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pump_staff_avatars", 
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;