import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { RiUser3Fill } from "react-icons/ri";
import { TbLockFilled } from "react-icons/tb";
import { useUser } from '../context/UserContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const { setUsername: setGlobalUsername } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("Vui lòng điền tên đăng nhập và mật khẩu.");
            return;
        }

        const response = await fetch(process.env.REACT_APP_API_URL + '/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            setGlobalUsername(username);
            navigate('/user/dashboard');
        } else {
            if (data.error === "Username not found") {
                setError("Tên đăng nhập không tồn tại.");
            } else {
                setError(data.error || "Đã xảy ra lỗi!");
            }
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div style={{ backgroundColor: 'transparent' }}>
                <img 
                    src="https://static.ybox.vn/2020/7/5/1594954570276-1539429242543-Trung%20ta%CC%82m%20pha%CC%81t%20trie%CC%82%CC%89n%20KH%20&%20CN%20tre%CC%89.jpg"
                    alt=""
                    style={{ width: '500px', height: '250px', marginTop: '70px' }} 
                />
            </div>
            <div className="login-container" style={{marginLeft: '350px', marginBottom: '53px'}} >
                <div className='container'>
                    <div className="text-center mb-3">
                        <h2 className="h5" style={{ textTransform: 'uppercase' }} >User Login</h2> 
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label><RiUser3Fill className='me-1 mb-1'/>Username</label>
                            <input
                                type="text"
                                className="form-control w-100"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label><TbLockFilled className='me-1 mb-1'/>Password</label>
                            <input
                                type="password"
                                className="form-control w-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div className="text-danger">{error}</div>}
                        <div className="d-flex justify-content-center mt-3">
                            <button type="submit" className="btn btn-primary" style={{ textTransform: 'uppercase' }}>Login</button>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            Don't have an account? <Link to="/user/register" style={{ textDecoration: 'none' }}>Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;