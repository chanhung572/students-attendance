import React, { useState } from 'react';
import axios from 'axios';
import { IoIosCreate } from "react-icons/io";

const CreateContest = () => {
    const [contestName, setContestName] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
    
        if (new Date(startDateTime) >= new Date(endDateTime)) {
            setMessage('Ngày và giờ kết thúc phải sau ngày và giờ bắt đầu');
            return;
        }
    
        const formData = new FormData();
        formData.append('contestName', contestName);
        formData.append('description', description);
        formData.append('startDateTime', startDateTime);
        formData.append('endDateTime', endDateTime);
        if (image) {
            formData.append('image', image);
        }
    
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/api/createcontest', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            const data = response.data;
            setMessage(data.message || 'Cuộc thi đã được tạo thành công!');
        } catch (error) {
            console.error('Submission error:', error);
            setMessage('Error: ' + (error.response?.data.message || 'Có lỗi xảy ra'));
        }
    };

    return (
        <div className="rounded-start-4 container" style={{ height: '88vh', backgroundColor: '#E8E8E8' }}>
            <h5 style={{ paddingBottom: '35px' }}>Tạo Cuộc Thi Mới <IoIosCreate className='me-1 mb-1' /></h5>
            <div style={{ backgroundColor: 'white', borderRadius: '3px', padding: '38px 20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Tên Cuộc Thi</label>
                        <input
                            type="text"
                            className="form-control"
                            value={contestName}
                            onChange={(e) => setContestName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Mô Tả</label>
                        <textarea
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Thời Gian Bắt Đầu</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Thời Gian Kết Thúc</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Tải Lên Hình Ảnh</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Tạo Cuộc Thi</button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
        </div>
    );
};

export default CreateContest;