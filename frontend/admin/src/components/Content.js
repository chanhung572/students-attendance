import React, { useState, useEffect } from 'react';
import '../style/Content.css';
import { RiGraduationCapFill } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import { MdAdminPanelSettings } from "react-icons/md";

const Content = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalContests, setTotalContests] = useState(0);
    const [totalAdminsAccount, setTotalAdminsAccount] = useState(0);
    const [totalUsersAccount, setTotalUsersAccount] = useState(0);


    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const studentsResponse = await fetch(process.env.REACT_APP_API_URL + '/api/totalstudents');
                const contestsResponse = await fetch(process.env.REACT_APP_API_URL + '/api/totalcontests');
                const adminsResponse = await fetch(process.env.REACT_APP_API_URL + '/api/totaladminsaccount');
                const usersResponse = await fetch(process.env.REACT_APP_API_URL + '/api/totalusersaccount');
                const studentsData = await studentsResponse.json();
                const contestsData = await contestsResponse.json();
                const adminsData = await adminsResponse.json();
                const usersData = await usersResponse.json();
    
                setTotalStudents(studentsData.total);
                setTotalContests(contestsData.total);
                setTotalAdminsAccount(adminsData.total);
                setTotalUsersAccount(usersData.total);
            } catch (error) {
                console.error('Error fetching totals:', error);
            }
        };
    
        fetchTotals();
}, []);

    return (
        <div className="main-content" >
            <div className="totals">
                <div className="total-box"> 
                    <h6><MdAdminPanelSettings className='me-1 mb-1' style={{ fontSize:'25px'}}/> Tổng tài khoản admin:</h6>
                    <p>{totalAdminsAccount}</p>
                </div>

                <div className="total-box">
                    <h6><FaUserShield className='me-1 mb-1' style={{ fontSize:'25px'}}/> Tổng tài khoản user:</h6>
                    <p>{totalUsersAccount}</p>
                </div>
                  
                <div className="total-box">
                    <h6><RiGraduationCapFill className='me-1 mb-1'style={{ fontSize:'25px'}}/> Tổng sinh viên:</h6>
                    <p>{totalStudents}</p>
                </div>
                
                <div className="total-box">
                    <h6><GiAchievement className='me-1 mb-1' style={{ fontSize:'25px'}}/> Tổng cuộc thi:</h6>
                    <p>{totalContests}</p>
                </div>
            </div>
        </div>
    );
};

export default Content;
