import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";

import authRoutes from "./Routes/auth.js";
import projectRoutes from "./Routes/projectRoutes.js";
import paymentRoutes from "./Routes/payments.js";

const app = express();

// ======= Session Configuration =======
app.use(session({
  secret: 'your-secret-key-123', // Use a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ======= CORS Configuration =======
const allowedOrigins = [
  "http://localhost:3000",
  "https://projecthouse-6k0t.onrender.com",
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);
    if (!origin) return callback(null, true); // Allow tools like Postman

    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedAllowed = allowedOrigins.map(o => o.trim().toLowerCase());

    if (!normalizedAllowed.includes(normalizedOrigin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ======= Middleware =======
app.use(express.json());

// ======= Authentication Middleware =======
const authenticate = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized - Please login first" });
  }
  next();
};

// ======= Routes =======
// Public
app.use("/api/auth", authRoutes);

// Protected
app.use("/api/projects", authenticate, projectRoutes);
app.use("/api/payment", authenticate, paymentRoutes);

// ======= MongoDB Connection =======
const uri = "mongodb+srv://Hrishi:Hrishi2003@project.z7kmgao.mongodb.net/project?retryWrites=true&w=majority&appName=project";

mongoose.connect(uri)
  .then(() => console.log("🍌 MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ======= Start Server =======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`💀 Server running on port ${PORT} 👀`));
