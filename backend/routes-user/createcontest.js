const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const db = require('../db'); 

// Tạo một cuộc thi mới
router.post('/createcontest', upload.single('image'), async (req, res) => {
    const { contestName, description, startDateTime, endDateTime } = req.body;
    const image = req.file ? req.file.filename : null; // Truy cập tệp đã tải lên

    // Kiểm tra xem tất cả các tham số có được cung cấp không
    if (!contestName || !description || !startDateTime || !endDateTime || !image) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc.' });
    }

    // Tạo URL cho hình ảnh
    const imageUrl = `${process.env.API_BASE_URL}uploads/${image}`;
    
    // Tạo truy vấn SQL để chèn cuộc thi mới
    const query = 'INSERT INTO contests_list (contestName, description, startDateTime, endDateTime, image) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [contestName, description, startDateTime, endDateTime, imageUrl], (err, results) => {
        if (err) {
            console.error('Error creating contest:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi tạo cuộc thi.', error: err });
        }
        res.status(201).json({ message: 'Cuộc thi đã được tạo thành công!', contestId: results.insertId });
    });
});

// Xóa một cuộc thi
router.post('/deletecontest', async (req, res) => {
    const { contestName } = req.body;

    // Kiểm tra xem contestName có được cung cấp không
    if (!contestName) {
        return res.status(400).json({ message: 'Tên cuộc thi là bắt buộc.' });
    }

    // Tạo truy vấn SQL để xóa cuộc thi
    const query = 'DELETE FROM contests_list WHERE contestName = ?';

    db.query(query, [contestName], (err, results) => {
        if (err) {
            console.error('Error deleting contest:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa cuộc thi.', error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cuộc thi không tìm thấy.' });
        }

        res.status(200).json({ message: 'Cuộc thi đã được xóa thành công!' });
    });
});

// Kiểm tra tên cuộc thi có tồn tại không
router.post('/checkcontestname', async (req, res) => {
    const { contestName } = req.body;

    const query = 'SELECT COUNT(*) AS count FROM contests_list WHERE contestName = ?';
    
    db.query(query, [contestName], (err, results) => {
        if (err) {
            console.error('Error checking contest name:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi kiểm tra tên cuộc thi.', error: err });
        }
        const exists = results[0].count > 0;
        res.status(200).json({ exists });
    });
});

// Cập nhật thông tin cuộc thi
router.post('/updatecontest', upload.single('image'), async (req, res) => {
    const { contestName, oldContestName, description, startDateTime, endDateTime } = req.body;
    const image = req.file ? req.file.filename : null; // Truy cập tệp đã tải lên

    // Kiểm tra xem tất cả các tham số có được cung cấp không
    if (!contestName || !description || !startDateTime || !endDateTime || !oldContestName) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc.' });
    }

    // Kiểm tra xem tên cuộc thi mới có tồn tại không
    const nameExistsQuery = 'SELECT COUNT(*) AS count FROM contests_list WHERE contestName = ?';
    db.query(nameExistsQuery, [contestName], (err, results) => {
        if (err) {
            console.error('Error checking contest name:', err);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi kiểm tra tên cuộc thi.', error: err });
        }
        
        const nameExists = results[0].count > 0;
        if (nameExists && contestName !== oldContestName) {
            return res.status(400).json({ message: 'Tên cuộc thi đã tồn tại. Vui lòng chọn tên khác.' });
        }

        // Tạo URL cho hình ảnh
        const imageUrl = image ? `${process.env.API_BASE_URL}/uploads/${image}` : null;

        // Tạo truy vấn SQL để cập nhật thông tin cuộc thi
        const query = 'UPDATE contests_list SET contestName = ?, description = ?, startDateTime = ?, endDateTime = ?, image = ? WHERE contestName = ?';
        db.query(query, [contestName, description, startDateTime, endDateTime, imageUrl, oldContestName], (err, results) => {
            if (err) {
                console.error('Error updating contest:', err);
                return res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật cuộc thi.', error: err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Cuộc thi không tìm thấy.' });
            }

            res.status(200).json({ message: 'Cuộc thi đã được cập nhật thành công!' });
        });
    });
});

module.exports = router;