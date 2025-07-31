const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch all roles from the database
router.get('/admin/getroles', (req, res) => {
    const query = 'SELECT * FROM roles';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching roles', error: err });
        }
        res.json(results);
    });
});

// Add a new role to the database
router.post('/admin/addroles', async (req, res) => {
    const { role, description } = req.body; // Assuming you send role and description
    if (!role || !description) {
        return res.status(400).json({ message: 'Role and description are required' });
    }

    try {
        await db.query('INSERT INTO roles (role, description) VALUES (?, ?)', [role, description]);
        res.status(201).json({ message: 'Role added successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error adding role' });
    }
});

// Update an existing role in the database
router.put('/admin/updaterole/:id', async (req, res) => {
    const { id } = req.params; // Get the role ID from the URL parameters
    const { role, description } = req.body; // Get the new role and description from the request body

    if (!role || !description) {
        return res.status(400).json({ message: 'Role and description are required' });
    }

    try {
        const result = await db.query('UPDATE roles SET role = ?, description = ? WHERE id = ?', [role, description, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating role' });
    }
});

module.exports = router;