import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username.length === 0) {
            alert("Username has been left blank!");
        } else if (password.length === 0) {
            alert("Password has been left blank!");
        } else if (fullname.length === 0) {
            alert("Full name has been left blank!");
        } else {
            const url = process.env.REACT_APP_API_URL + '/api/admin/register'; 
            const userData = {
                username,
                password,
                fullname
            };

            axios.post(url, userData)
                .then(response => {
                    const message = response.data.message || "Registration successful!";
                    alert(message);
                    setUserName('');
                    setPassword('');
                    setFullname('');
                })
                .catch(error => alert('Error: ' + (error.response?.data?.message || error.message)));
        } // Ensure this closing brace is here
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

            <div className="regist-container" style={{ marginLeft: '350px', marginBottom: '53px' }}>
                <div className='container'>
                    <div className="text-center mb-3">
                        <h2 className="h5">Admin Register</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="form-control w-100"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password" 
                                name="password"
                                id="password"
                                className="form-control w-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                className="form-control w-100"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <button 
                                type="submit" 
                                className="btn btn-primary">
                                Register
                            </button>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <Link to="/admin/login" className="btn btn-primary">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;