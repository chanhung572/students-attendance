// Existing imports
const express = require('express');
const router = express.Router();
const db = require('../db');

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra tài khoản có tồn tại
    const sql = 'SELECT * FROM users WHERE username = ?';
    
    db.query(sql, [username], (err, result) => {
        if (err) return res.json({ success: false, error: "Lỗi hệ thống." });
        
        // Nếu không tìm thấy tài khoản
        if (result.length === 0) {
            return res.json({ success: false, error: "Tên đăng nhập không tồn tại." });
        } 
        
        const user = result[0];

        // Kiểm tra mật khẩu
        if (user.password !== password) {
            return res.json({ success: false, error: "Mật khẩu không chính xác." });
        }

        // Nếu tài khoản chưa kích hoạt
        if (!user.isActive) {
            return res.json({ success: false, error: "Tài khoản chưa kích hoạt." });
        }

        // Nếu tất cả đều đúng
        return res.json({ success: true });
    });
});

// Register endpoint
router.post('/register', (req, res) => {
    const { username, password, phone, fullname } = req.body;

    // Kiểm tra các trường
    if (!username || !password || !phone || !fullname) {
        return res.json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const checkSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkSql, [username], (err, results) => {
        if (err) return res.json({ success: false, message: "Lỗi kiểm tra tên người dùng" });
        
        if (results.length > 0) {
            return res.json({ success: false, message: "Tên người dùng đã tồn tại" });
        }

        const sql = 'INSERT INTO users (username, password, phone, fullname, isActive) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [username, password, phone, fullname, false], (err, result) => {
            if (err) return res.json({ success: false, message: "Error saving user." });
            return res.json({ success: true, message: "Đăng kí thành công! Vui lòng kích hoạt tài khoản." });
        });
    });
});

// Kích hoạt tài khoản
router.post('/admin/activate', (req, res) => {
    const { id } = req.body;
    
    const sql = 'UPDATE users SET isActive = ? WHERE id = ?';
    db.query(sql, [true, id], (err, result) => {
        if (err) return res.json({ success: false, message: "Error activating account." });
        
        if (result.affectedRows > 0) {
            return res.json({ success: true, message: "Kích hoạt thành công" });
        } else {
            return res.json({ success: false, message: "Kích hoạt thất bại" });
        }
    });
});

// hủy kích hoạt
router.post('/admin/deactivate', (req, res) => {
    const { id } = req.body;

    const sql = 'UPDATE users SET isActive = ? WHERE id = ?';
    db.query(sql, [false, id], (err, result) => {
        if (err) return res.json({ success: false, message: "Error deactivating account." });

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: "Kích hoạt thành công" });
        } else {
            return res.json({ success: false, message: "Hủy kích hoạt thành công" });
        }
    });
});


// Get all users endpoint
router.get('/admin/getusername', (req, res) => {
    const sql = 'SELECT username FROM users';
    
    db.query(sql, (err, result) => {
        if (err) return res.json({ success: false, error: "Error fetching username" });
        
        return res.json({ success: true, users: result });
    });
});

module.exports = router;