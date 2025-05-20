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

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/yourdbname", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🍌 MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`💀 Server running on port ${PORT} 👀`));
