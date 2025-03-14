// ================================
// 📂 routes/userRoutes.js (Improved)
// ================================

const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// ✅ Fetch User Details
router.get('/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, username, email, profile_pic FROM users WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Fetch User Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ✅ Update User Details
router.put('/:id', async (req, res) => {
    const { username, email, profilePic, password } = req.body;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        await pool.query(
            `UPDATE users 
             SET username = $1, email = $2, profile_pic = $3, password = COALESCE($4, password) 
             WHERE id = $5`,
            [username, email, profilePic, hashedPassword, req.params.id]
        );
        res.json({ message: 'User updated successfully!' });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;