const express = require("express");
const pool = require("../db");

const router = express.Router();

// ✅ Get All Stores
router.get("/", async (req, res) => {
  console.log("➡️ Received request to fetch all stores...");

  try {
    const result = await pool.query("SELECT * FROM stores ORDER BY id ASC");

    if (result.rows.length === 0) {
      console.warn("⚠️ No stores found in the database.");
      return res.status(404).json({ message: "No stores found." });
    }

    console.log(`✅ Fetched ${result.rows.length} stores from the database.`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching stores from the database:", error);
    res.status(500).json({ message: "Server error fetching stores!" });
  }
});

module.exports = router;
