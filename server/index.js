require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

// Import your route files
const authRoutes = require("./routes/auth");
const storeRoutes = require("./routes/storeRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require('./routes/userRoutes');
const npcRoutes = require('./routes/npcs');  // <-- New NPC Routes
const npcRelationshipRoutes = require('./routes/npcRelationships');  // <-- New Relationship Routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("Fantasy Bazaar API is running!");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Store routes
app.use("/api/stores", storeRoutes);

// Item routes
app.use("/api/items", itemRoutes);

// User routes
app.use('/api/users', userRoutes);

// NPC Management routes
app.use('/api/npcs', npcRoutes);

// NPC Relationship routes
app.use('/api/npc-relationships', npcRelationshipRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
