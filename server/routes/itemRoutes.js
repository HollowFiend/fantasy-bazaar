const express = require('express');
const router = express.Router();
const pool = require('../db');

// Map categories to corresponding detail tables
const categoryTableMap = {
  Weapon: 'weapon_details',
  Ring: 'ring_details',
  Armor: 'armor_details',
  Potion: 'potion_details',
  Scroll: 'scroll_details',
  Food: 'food_details',
  Staff: 'staff_details'
};

// Generic Route for Fetching Items by Store Type with JOIN
router.get('/:storeType', async (req, res) => {
  const { storeType } = req.params;

  try {
    // 1. Fetch the store_id for the given storeType
    const storeQuery = await pool.query(
      `SELECT id FROM stores WHERE store_type = $1`,
      [storeType]
    );

    if (storeQuery.rows.length === 0) {
      return res.status(404).json({ error: `No store found for type: ${storeType}` });
    }

    const storeId = storeQuery.rows[0].id;

    // 2. Fetch all items for that store
    const itemsQuery = await pool.query(
      `SELECT * FROM items WHERE store_id = $1`,
      [storeId]
    );

    // 3. Fetch details for each item based on its category
    const detailedItems = await Promise.all(
      itemsQuery.rows.map(async (item) => {
        const detailTable = categoryTableMap[item.category];

        if (!detailTable) {
          return { ...item, details: null };
        }

        const detailQuery = await pool.query(
          `SELECT * FROM ${detailTable} WHERE item_id = $1`,
          [item.id]
        );

        return {
          ...item,
          details: detailQuery.rows[0] || null
        };
      })
    );

    res.json(detailedItems);
  } catch (error) {
    console.error(`Error fetching items for ${storeType}:`, error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
