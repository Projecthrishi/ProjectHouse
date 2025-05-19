import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ProjectRoutes from "./Routes/projectRoutes.js"; 
import paymentRoutes from "./Routes/payments.js";

// Adjust the path if needed

const app = express();

app.use(cors());
app.use(express.json()); 
app.use("/api/payment", paymentRoutes);// Ensure you have this middleware

// MongoDB connection
mongoose.connect("mongodb://localhost:27017")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Mount the project routes
app.use("/api/projects", ProjectRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
