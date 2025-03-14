// routes/npcs.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// 🔍 Fetch all NPCs with their store information
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT npcs.*, stores.name AS store_name 
      FROM npcs
      JOIN stores ON npcs.store_id = stores.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching NPCs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;