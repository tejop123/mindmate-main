const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
const FRONTEND_URL = process.env.CORS_ORIGIN || "*";
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// ✅ Health check
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Mindmate API is running");
});

// Routes
const nodesRoutes = require("./routes/nodes.js");
app.use("/api/nodes", nodesRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
