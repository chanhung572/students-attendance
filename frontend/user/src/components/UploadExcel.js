import React, { useState } from 'react';
import axios from 'axios';

const UploadExcel = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Vui lòng chọn một file Excel trước!');
            return;
        }

        const formData = new FormData();
        formData.append('excel', file);

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/api/uploadexcel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Kiểm tra nếu upload thành công
            if (response.data.msg === 'ok') {
                onUpload(response.data.data.successData);
                setSuccessMessage('Tải lên thành công!');
                setError('');
            } else {
                setError('Có lỗi xảy ra khi tải lên file Excel.');
            }
        } catch (err) {
            console.error('Error uploading file:', err);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải lên.');
        } finally {
            setFile(null);
        }
    };

    return (
        <div className="mb-3">
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="form-control mb-2"
            />
            <button onClick={handleUpload} className="btn btn-primary">
                Tải lên
            </button>
        </div>
    );
};

export default UploadExcel;