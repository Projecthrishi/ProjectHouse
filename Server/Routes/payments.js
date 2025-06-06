
import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Purchase from "../models/purchase.js"; 
import mongoose from "mongoose";
const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_6ayj8R3LzCrrQd",
  key_secret: "5tDytRiqiIXKLouazdALMdGb",
});

// Create Razorpay order
router.post("/orders", async (req, res) => {
  try {
    const amount = req.body.amount * 100;
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// Verify payment
// ✅ Add userId and projectId in request body (from frontend)
// ✅ Add userId and projectId in request body (from frontend)
router.post("/verify", async (req, res) => {
  try {
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      projectId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ Save purchase to DB
      
      const purchase = new Purchase({
        userId: new mongoose.Types.ObjectId(userId),
        projectId: new mongoose.Types.ObjectId(projectId),
        paymentId: razorpay_payment_id,
      });
      await purchase.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified and purchase recorded.",
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/save", async (req, res) => {
  console.log("Incoming POST /save request body:", req.body); 
  try {
    const { userId, projectId, paymentId } = req.body;

    if (!userId || !projectId || !paymentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const alreadyExists = await Purchase.findOne({ userId, projectId });
    if (alreadyExists) {
      return res.status(400).json({ message: "Already purchased" });
    }

    const newPurchase = new Purchase({
      userId,
      projectId,
     paymentId: response.razorpay_payment_id,
    });

    await newPurchase.save();

    res.status(201).json({ message: "Purchase saved successfully" });
  } catch (err) {
    console.error("🔴 Error saving purchase:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

