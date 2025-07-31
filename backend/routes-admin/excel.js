const express = require('express');
const xlsx = require('xlsx');
const fs = require('fs');
const db = require('../db');
const router = express.Router();
const fileUpload = require('express-fileupload');

const uploadOpts = { 
    useTempFiles: true,
    tempFileDir: '/tmp/'
}

// Wrapper để sử dụng db.query với promise
const queryDb = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

// API để upload file Excel
router.post('/admin/uploadexcel', fileUpload(uploadOpts), async (req, res) => {
    try { 
        const { excel } = req.files;

        // Kiểm tra định dạng file
        if (excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            fs.unlinkSync(excel.tempFilePath);
            return res.status(400).json({ message: 'Vui lòng tải lên file Excel.' });
        }

        // Đọc file Excel
        const workbook = xlsx.readFile(excel.tempFilePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const successData = [];
        const failedData = [];

        for (let i = 0; i < data.length; i++) {
            const { studentid, studentname, studentunit, attendance } = data[i];

            // Kiểm tra giá trị attendance, nếu không có thì gán mặc định là 'Vắng mặt'
            const attendanceValue = attendance || 'Vắng mặt';

            // Kiểm tra xem studentid đã tồn tại chưa
            const checkSql = 'SELECT COUNT(*) AS count FROM students_list WHERE studentid = ?';
            const checkResult = await queryDb(checkSql, [studentid]);

            // Kiểm tra xem checkResult có dữ liệu không
            if (!checkResult || checkResult.length === 0 || checkResult[0].count === undefined) {
                console.error('Error fetching student count:', checkResult);
                return res.status(500).json({ message: 'Có lỗi xảy ra khi kiểm tra SBD sinh viên.' });
            }

            if (checkResult[0].count > 0) {
                // Nếu studentid đã tồn tại, bỏ qua
                failedData.push({ studentid, message: 'SBD đã tồn tại' });
                continue; // Bỏ qua sinh viên này
            }

            // Thêm sinh viên mới vào cơ sở dữ liệu
            const sql = 'INSERT INTO students_list (studentid, studentname, studentunit, attendance) VALUES (?, ?, ?, ?)';
            const result = await queryDb(sql, [studentid, studentname, studentunit, attendanceValue]);

            if (result.affectedRows) {
                successData.push(data[i]);
            } else {
                failedData.push(data[i]);
            }
        }

        fs.unlinkSync(excel.tempFilePath);
        return res.json({ msg: 'ok', data: { successData, failedData } });
    } catch (error) {
        console.error('Error uploading Excel file:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi tải file lên.', error: error.message });
    }
});

module.exports = router;