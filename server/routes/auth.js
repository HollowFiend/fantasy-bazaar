// ================================
// 📂 routes/auth.js (Improved)
// ================================

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// ✅ Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = rows[0];

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, userId: user.id, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ✅ Registration Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
