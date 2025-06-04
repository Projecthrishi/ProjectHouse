// routes/download.js
import express from "express";
import mongoose from "mongoose";
import Purchase from "../models/purchase.js";
import Project from "../models/Project.js";
import { protect } from "../middleware/authmiddleware.js"; // 👈 FIXED

const router = express.Router();

router.get("/:projectId", protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const purchase = await Purchase.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      projectId: new mongoose.Types.ObjectId(projectId),
    });

    if (!purchase) {
      return res.status(403).json({
        message: "You have not purchased this project",
      });
    }

    const project = await Project.findById(projectId);
    if (!project || !project.downloadLink) {
      return res.status(404).json({
        message: "Project not found or no download link",
      });
    }

    res.json({ downloadLink: project.downloadLink });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
