const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch all admin accounts
router.get('/admin/getadminaccount', (req, res) => {
    const query = 'SELECT * FROM admin';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching get admin account', error: err });
        }
        res.json(results);
    });
});

// Fetch all user accounts
router.get('/admin/getuseraccount', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching get user account', error: err });
        }
        res.json(results);
    });
});
module.exports = router;