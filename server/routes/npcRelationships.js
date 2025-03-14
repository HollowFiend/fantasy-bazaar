const express = require('express');
const router = express.Router();
const pool = require('../db');
  
// Fetch all NPC relationships for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        npc_relationships.id,
        npc_relationships.npc_id,
        npc_relationships.relationship_score,
        npc_relationships.last_updated,
        npcs.name AS npc_name,
        stores.name AS store_name
      FROM npc_relationships
      JOIN npcs ON npc_relationships.npc_id = npcs.id
      JOIN stores ON npcs.store_id = stores.id
      WHERE npc_relationships.user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No relationships found for this user.' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching NPC relationships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Relationship Score
router.put('/:userId/:npcId', async (req, res) => {
  const { userId, npcId } = req.params;
  const { relationship_score } = req.body;

  try {
    const result = await pool.query(`
      UPDATE npc_relationships
      SET relationship_score = $1, last_updated = NOW()
      WHERE user_id = $2 AND npc_id = $3
    `, [relationship_score, userId, npcId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Relationship not found to update.' });
    }

    res.json({ message: 'Relationship score updated!', relationship_score });
  } catch (error) {
    console.error('Error updating relationship:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
