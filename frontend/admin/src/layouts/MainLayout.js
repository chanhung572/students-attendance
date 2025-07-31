import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ children }) => {    
    return (
        <div>
            <Header />
            <div>
                <div>
                    <div>
                        <Sidebar />
                    </div>
                    
                    <div>
                        {children}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;