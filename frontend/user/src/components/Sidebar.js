import React , { useState, useRef, useEffect } from 'react';
import '../style/Sidebar.css';
import { IoHome } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import { RiFileList2Fill } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { useUser } from '../context/UserContext';

const Sidebar = () => {
    const {username} = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const dropdownRef = useRef(null);
        
    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };
        
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };
        
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <aside className="p-4 position-fixed" style={{ height: '100%', top: '100px', width: '230px', backgroundColor: 'white' }}>
            <ul className="list-unstyled">
                <li className="hover-item p-1 rounded mb-2" style={{ fontSize: '18px' }}>
                    <a href="/user/dashboard" className="text-muted text-decoration-none fw-normal"><IoHome className='me-1 mb-1'/>Trang chủ</a>
                </li>
                <li style={{ padding: '10px 0', textTransform: 'uppercase', fontSize: '12px' }}>
                    <a href="/user/dashboard" className="text-muted text-decoration-none fst-normal">Menu</a>
                </li>
                <li className="hover-item p-1 rounded mb-2" style={{ fontSize: '16px' }}>
                    <a href="/user/createcontest" className="text-muted text-decoration-none fw-normal"><IoIosCreate className='me-1 mb-1'/>Tạo cuộc thi</a>
                </li>
                <li className="hover-item p-1 rounded mb-2" style={{ fontSize: '16px' }}>
                    <a href="/user/contestlist" className="text-muted text-decoration-none fw-normal"><RiFileList2Fill className='me-1 mb-1'/>Danh sách cuộc thi</a>
                </li>
                <li className="hover-item p-1 rounded mb-2" style={{ fontSize: '16px' }}>
                    <a href="/user/takeattendance" className="text-muted text-decoration-none fw-normal"><FaUserCog className='me-1 mb-1'/>Quản lí sinh viên</a>
                </li>
                <li className="hover-item p-1 rounded mb-2" style={{ fontSize: '16px' }}>
                    <a href="/user/studentlist" className="text-muted text-decoration-none fw-normal"><FaUserGraduate  className='me-1 mb-1'/>Danh sách sinh viên</a>
                </li>
            </ul>     
            <div className="btn-group" ref={dropdownRef} style={{ marginRight: '80px' }}>
                <button 
                    type="button" 
                    className="btn btn-outline-primary dropdown-toggle" 
                    onClick={toggleDropdown} 
                    aria-expanded={dropdownOpen}
                >
                    <IoIosSettings className='me-1 mb-1'/>
                </button>
                {dropdownOpen && (
                    <div className="dropdown-menu show" style={{ 
                        marginTop: '40px',
                        whiteSpace: 'nowrap', // Ngăn ngắt dòng
                        minWidth: 'auto', // Chiều rộng tự động theo nội dung
                    }}>
                        <a className="dropdown-item" href="/user/info-account-user">Xin chào <strong style={{ textTransform: 'uppercase' }}>{username}</strong></a>
                        <a className="dropdown-item" href="/">Liên hệ</a>
                    <div className="dropdown-divider"></div>
                        <a href="/user/login" className="dropdown-item">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>Đăng xuất
                        </a>
                    </div>
                )}
            </div>
        </aside>
        
    );
};

export default Sidebar;