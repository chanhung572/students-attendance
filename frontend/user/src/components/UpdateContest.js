import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const UpdateContest = ({ contest, onClose, onUpdate }) => {
    const [contestName, setContestName] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [message, setMessage] = useState('');
    const [imageFile, setImageFile] = useState(null); // Trạng thái để lưu tệp hình ảnh

    useEffect(() => {
        if (contest) {
            setContestName(contest.contestName);
            setDescription(contest.description);
            setStartDateTime(contest.startDateTime);
            setEndDateTime(contest.endDateTime);
        }
    }, [contest]);

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]); // Lưu tệp hình ảnh vào trạng thái
    };

    const handleUpdateContest = async () => {

        // Kiểm tra tên cuộc thi mới trước khi cập nhật
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/api/checkcontestname', { contestName });
            if (response.data.exists && contestName !== contest.contestName) {
                setMessage('Tên cuộc thi đã tồn tại! Vui lòng chọn tên khác.');
                return;
            }
        } catch (error) {
            console.error('Error checking contest name:', error);
        }

        // Tạo đối tượng FormData để gửi tệp hình ảnh
        const formData = new FormData();
        formData.append('contestName', contestName);
        formData.append('oldContestName', contest.contestName);
        formData.append('description', description);
        formData.append('startDateTime', startDateTime);
        formData.append('endDateTime', endDateTime);
        if (imageFile) {
            formData.append('image', imageFile); // Thêm tệp hình ảnh vào FormData
        }

        // Gọi hàm onUpdate để cập nhật
        onUpdate(formData);
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Cập Nhật Thông Tin Cuộc Thi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <div className="alert alert-danger">{message}</div>}
                <div className="mb-3">
                    <label className="form-label">Tên cuộc thi</label>
                    <input
                        type="text"
                        className="form-control"
                        value={contestName}
                        onChange={(e) => setContestName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ngày bắt đầu</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ngày kết thúc</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tải ảnh lên</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
                <Button variant="primary" onClick={handleUpdateContest}>Lưu Thay Đổi</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateContest;