import express from "express";
import Project from "../models/Project.js"; // Make sure this path is correct

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new project
router.post("/", async (req, res) => {
  try {
    const { title, description, techStack, price, downloadLink } = req.body;

    const newProject = new Project({
      title,
      description,
      techStack,  // ✅ match the schema
      price,
      downloadLink,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Error creating project" });
  }
});

// DELETE a project by ID
router.delete("/:id", async (req, res) => {
  try {
    console.log("Deleting project with id:", req.params.id); // Debugging log
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
