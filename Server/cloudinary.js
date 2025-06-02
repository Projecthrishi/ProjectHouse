import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-zip", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "projects",
    });

    fs.unlinkSync(req.file.path); // cleanup

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload failed", err);
    res.status(500).json({ message: "Failed to upload" });
  }
});

export default router;
