import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/Rightmenu.css';
import { PiStudentBold } from "react-icons/pi";
import { GrAchievement } from "react-icons/gr";
import { HiBellAlert } from "react-icons/hi2";

const RightMenu = ({ contests }) => {
    const [date, setDate] = useState(new Date());
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalContests, setTotalContests] = useState(0);

    const onChange = (date) => {
        setDate(date);
    };

    const selectedContests = Array.isArray(contests) ? contests.filter(contest => {
        const contestDate = new Date(contest.startDateTime);
        return contestDate.toDateString() === date.toDateString();
    }) : [];

    const upcomingContests = Array.isArray(contests) ? contests.filter(contest => {
        const contestDate = new Date(contest.startDateTime);
        return contestDate > new Date(); 
    }).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)) : [];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12; 
        hours = hours ? String(hours) : '12'; 

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const studentsResponse = await fetch(process.env.REACT_APP_API_URL + '/api/totalstudents');
                const contestsResponse = await fetch(process.env.REACT_APP_API_URL + '/api/totalcontests');
                const studentsData = await studentsResponse.json();
                const contestsData = await contestsResponse.json();
    
                setTotalStudents(studentsData.total);
                setTotalContests(contestsData.total);
            } catch (error) {
                console.error('Error fetching totals:', error);
            }
        };
    
        fetchTotals();
    }, []);

    return (
        <aside className="p-4 rounded-start position-fixed calendar-container" style={{ height: '100%', top: '105px', right: '0', width: '350px', backgroundColor: '#E8E8E8' }}>
            <div className="calendar-wrapper" style={{ marginTop: '-1px' }}>
                <div className="calendar-header">
                    <h5 className="calendar-title">Calendar</h5>
                </div>
                <Calendar
                    onChange={onChange}
                    value={date}
                    className="react-calendar"
                />
                <div className="event-info">
                    <h6>Thông tin cuộc thi:</h6>
                    {selectedContests.length > 0 ? (
                        selectedContests.map((contest, index) => (
                            <div key={index}>
                                <strong>{contest.contestName}</strong> - {formatDate(contest.startDateTime)} {/* Ensure this is startDateTime */}
                            </div>
                        ))
                    ) : (
                        <div>Không có cuộc thi diễn ra</div>
                    )}
                </div>
            </div>
            <div className="totals">
                <div className="total-box">
                    <h6><PiStudentBold className='me-1 mb-1'/> Tổng sinh viên:</h6>
                    <p>{totalStudents}</p>
                </div>
                <div className="total-box">
                    <h6><GrAchievement className='me-1 mb-1'/> Tổng cuộc thi:</h6>
                    <p>{totalContests}</p>
                </div>
            </div>
            <div className="upcoming-contests">
                <h6><HiBellAlert/> Cuộc thi sắp diễn ra</h6>
                {upcomingContests.length > 0 ? (
                    <div>
                        <p>{formatDate(upcomingContests[0].startDateTime)}</p>
                    </div>
                ) : (
                    <div>Không có cuộc thi sắp diễn ra</div>
                )}
            </div>
        </aside>
    );
};

export default RightMenu;