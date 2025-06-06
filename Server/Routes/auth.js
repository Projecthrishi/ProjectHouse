import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      role: "user" 
    });
    
    await newUser.save();

    // Set session after successful signup
    req.session.user = { 
      id: newUser._id, 
      role: newUser.role 
    };
    
    res.status(201).json({ 
      message: "User created successfully", 
      role: newUser.role 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
    
        // Set session after successful login
        req.session.user = { 
          id: user._id, 
          role: user.role 
        };
        
        res.status(200).json({ 
          message: "Login successful", 
          role: user.role,
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    
// Check authentication status
router.get("/check", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ 
      isAuthenticated: false, 
      message: "Not authenticated" 
    });
  }
  res.status(200).json({ 
    isAuthenticated: true, 
    user: req.session.user 
  });
});



export default router;