import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateContest from './components/CreateContest';
import MainLayout from './layouts/MainLayout';
import TakeAttendance from './components/TakeAttendance';
import ContestList from './components/ContestList';
import Register from './components/Register';
import StudentList from './components/StudentList';
import InfoAccountUser from './components/InfoAccountUser';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/user/register" element={<Register />} />
                    <Route path="/user/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/user/login" />} />

                    {/* Bọc các route trong MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route path="/user/dashboard" element={<Dashboard />} />
                        <Route path="/user/createcontest" element={<CreateContest />} />
                        <Route path="/user/contestlist" element={<ContestList />} />
                        <Route path="/user/takeattendance" element={<TakeAttendance />} />
                        <Route path="/user/studentlist" element={<StudentList />} />
                        <Route path="/user/info-account-user" element={<InfoAccountUser />} />
                    </Route>
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;