import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import RightMenu from '../components/RightMenu';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

const MainLayout = ({ children }) => {
    const [contests, setContests] = useState([]);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/api/getcontest');
                if (response.data.success) {
                    setContests(response.data.contests);
                }
            } catch (error) {
                console.error('Lỗi khi tải cuộc thi:', error);
            }
        };

        fetchContests();
    }, []);
    
    return (
        <div>
            <Header />
            <div className="d-flex">
                <div className="flex-shrink-0">
                    <Sidebar />
                </div>

                <div className="flex-grow-1">
                    {children}
                    <Outlet />
                </div>

                <div className="flex-shrink-0">
                    {/* <RightMenu /> */}
                    <RightMenu contests={contests} />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
