import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./Routes/auth.js";
import projectRoutes from "./Routes/projectRoutes.js";
import paymentRoutes from "./Routes/payments.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payment", paymentRoutes);

// MongoDB Atlas Connection
const uri = "mongodb+srv://Hrishi:Hrishi2003@project.z7kmgao.mongodb.net/project?retryWrites=true&w=majority&appName=project";


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🍌 MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`💀 Server running on port ${PORT} 👀`));
