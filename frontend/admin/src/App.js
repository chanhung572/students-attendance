import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MainLayout from './layouts/MainLayout';
import AccessGroup from './components/AccessGroup';
import AccessControl from './components/AccessControl';
import InfoAccount from './components/InfoAccount';
import StudentList from './components/StudentList';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/admin/register" element={<Register />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/admin/login" />} />

                    {/* Bọc các route trong MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/accessGroup" element={<AccessGroup />} />
                        <Route path="/admin/accessControl" element={<AccessControl />} />
                        <Route path="/admin/infoAccount" element={<InfoAccount />} />
                        <Route path="/admin/studentList" element={<StudentList />} />
                    </Route>
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;