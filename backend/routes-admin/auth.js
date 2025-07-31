// Existing imports
const express = require('express');
const router = express.Router();
const db = require('../db');

// Login endpoint
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';
    
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.json({ success: false, error: "Error" });
        
        if (result.length > 0) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, error: "Tên người dùng hoặc mật khẩu không hợp lệ" });
        }
    });
});

// Register endpoint
router.post('/admin/register', (req, res) => {
    console.log(req.body); // Kiểm tra dữ liệu nhận được
    const { username, password, fullname } = req.body;

    if (!username || !password || !fullname) {
        console.log("Missing fields: ", { username, password, fullname });
        return res.json({ success: false, message: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Check if the username already exists
    const checkSql = 'SELECT * FROM admin WHERE username = ?';
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Lỗi kiểm tra tên người dùng." });
        }
        if (results.length > 0) {
            return res.json({ success: false, message: "Tên người dùng đã tồn tại." });
        }

        // If the username doesn't exist, proceed to insert
        const sql = 'INSERT INTO admin (username, password, fullname) VALUES (?, ?, ?)';
        db.query(sql, [username, password, fullname], (err, result) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: "Error saving user." });
            }
            return res.json({ success: true, message: "Đăng kí thành công!" });
        });
    });
});


module.exports = router;