import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({ 
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  techStack: [String],
  downloadLink: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
 });
const Project = mongoose.model("Project", projectSchema);
export default Project;
