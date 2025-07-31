const express = require('express');
const router = express.Router();
const db = require('../db'); // Đảm bảo đường dẫn đúng

// Fetch total number of students
router.get('/totalstudents', (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM students_list';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching total students', error: err });
        }
        res.json({ total: results[0].total });
    });
});

// Fetch total number of contests
router.get('/totalcontests', (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM contests_list';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching total contests', error: err });
        }
        res.json({ total: results[0].total });
    });
});

module.exports = router;