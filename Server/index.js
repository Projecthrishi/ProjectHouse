import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./Routes/auth.js";
import projectRoutes from "./Routes/projectRoutes.js";
import paymentRoutes from "./Routes/payments.js";

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
"http://localhost:3000",     
               // Local frontend
  "https://projecthouse-6k0t.onrender.com",     // Deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);
    if (!origin) return callback(null, true); // Allow non-browser tools like Postman

    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedAllowed = allowedOrigins.map(o => o.trim().toLowerCase());

    if (!normalizedAllowed.includes(normalizedOrigin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payment", paymentRoutes);

// MongoDB Connection URI
const uri = "mongodb+srv://Hrishi:Hrishi2003@project.z7kmgao.mongodb.net/project?retryWrites=true&w=majority&appName=project";

mongoose.connect(uri)
  .then(() => console.log("🍌 MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`💀 Server running on port ${PORT} 👀`));
