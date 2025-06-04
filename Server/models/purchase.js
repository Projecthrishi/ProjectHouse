// models/Purchase.js
import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  paymentId: { type: String, required: true }, // Razorpay payment ID
  createdAt: { type: Date, default: Date.now }
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
