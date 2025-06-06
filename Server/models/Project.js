import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
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
demoLink: String,
    // You can remove this if using timestamps
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
