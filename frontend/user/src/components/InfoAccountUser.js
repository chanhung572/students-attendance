import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const InfoAccountUser = () => {
    const { username } = useUser(); 
    const [users, setUsers] = useState([]);
    const [showUserPassword, setShowUserPassword] = useState({}); // Trạng thái hiển thị mật khẩu user

    const togglePasswordVisibility = (id) => {
        setShowUserPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const userResponse = await fetch(process.env.REACT_APP_API_URL + '/api/admin/getuseraccount');
                const userData = await userResponse.json();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };
    
        fetchAccounts();
    }, []);

    // Find the currently logged-in user
    const currentUser = users.find(user => user.username === username);

    return (
        <div className="rounded-start-4 container" style={{ height: '88vh', backgroundColor: '#E8E8E8' }}>
            <h5>Thông tin tài khoản của bạn</h5>
            <div className="card mt-5">
                <div className="card-body">
                    {currentUser ? (
                        <>
                            <p className="card-text"><strong>Tên đăng nhập:</strong> {currentUser.username}</p>
                            <p className="card-text"><strong>Họ và tên:</strong> {currentUser.fullname}</p>
                            <p className="card-text"><strong>Số điện thoại:</strong> {currentUser.phone}</p>
                            <p className="card-text">
                                <strong>Mật khẩu:</strong> 
                                <span className="ms-2">
                                    {showUserPassword[currentUser.id] ? currentUser.password : '••••••••••'}
                                </span>
                                <button 
                                    onClick={() => togglePasswordVisibility(currentUser.id)} 
                                    className="btn btn-link ms-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    {showUserPassword[currentUser.id] ? 
                                        <AiFillEyeInvisible className='me-1 mb-1' style={{ fontSize: '20px', color: 'black' }} /> : 
                                        <AiFillEye className='me-1 mb-1' style={{ fontSize: '20px', color: 'black' }} />}
                                </button>
                            </p>
                        </>
                    ) : (
                        <p>Không tìm thấy thông tin tài khoản.</p>
                    )}
                </div>
            </div>          
        </div>
    );
};

export default InfoAccountUser;