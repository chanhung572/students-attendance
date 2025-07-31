import React, { useState, useEffect } from 'react';
import '../style/Content.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AccessControl = () => {
    const [usernames, setUsernames] = useState([]);

    useEffect(() => {
        // Fetch usernames from the server
        const fetchUsernames = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + '/api/admin/getusername'); 
                const data = await response.json();
                if (data.success) {
                    setUsernames(data.users);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Error fetching usernames:", error);
            }
        };

        fetchUsernames();
    }, []);

    const features = [
        'Tạo cuộc thi', 
        'Chỉnh sửa cuộc thi', 
        'Xóa cuộc thi', 
        'Điểm danh', 
        'Thêm mới sinh viên', 
        'Thêm sinh viên vào cuộc thi', 
        'Chỉnh sửa sinh viên', 
        'Xóa tất cả sinh viên', 
        'Xóa sinh viên', 
        'Upload Excel', 
        'Toàn quyền'
    ];

    return (
        <div className="main-content">
            <h5>Phân Quyền</h5>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th rowSpan="2" className="text-center align-middle">Username</th>
                        <th colSpan="11" className="text-center">Tính năng</th>
                    </tr>
                    <tr>
                        {features.map((feature, index) => (
                            <th key={index} className="text-center" style={{ fontSize: '15px' }}>{feature}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {usernames.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            {features.map((_, featureIndex) => (
                                <td key={featureIndex} style={{ textAlign: 'center' }}>
                                    <input type="checkbox"/>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccessControl;