import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./Routes/auth.js";
import projectRoutes from "./Routes/projectRoutes.js";
import paymentRoutes from "./Routes/payments.js";

const app = express();

// Middleware


const allowedOrigins = [
  "http://localhost:3000",
  "https://projecthouse-i1ob.onrender.com", // Match your frontend URL
      // Keep if still needed
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // if you use cookies/auth
}));

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
