const express = require('express');
const router = express.Router();
const db = require('../db'); // Đảm bảo đường dẫn đúng

// Fetch total number of admin
router.get('/totaladminsaccount', (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM admin';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching total admins', error: err });
        }
        res.json({ total: results[0].total });
    });
});

// Fetch total number of user
router.get('/totalusersaccount', (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM users';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching total users', error: err });
        }
        res.json({ total: results[0].total });
    });
});

module.exports = router;