const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
// if User.js is inside backend/models
const User = require("../models/User.js");

// POST login or register user
router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming data:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      user = new User({ email, password: hashedPassword });
      await user.save();

      console.log("🆕 New user created:", user);
      return res.status(201).json({ message: "New user created", user });
    }

    // If user exists, check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    console.log("✅ User logged in:", user);
    res.status(200).json({ message: "Login successful", user });

  } catch (err) {
    console.error("❌ Error in POST /api/nodes:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
