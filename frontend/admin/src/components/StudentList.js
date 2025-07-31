import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExcelUploadModal from './ExcelUploadModal';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedContest, setSelectedContest] = useState('');
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
    
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/api/admin/getstudents');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                setError('Error fetching students');
            } finally {
                setLoading(false);
            }
        };

        const fetchContests = async () => {
            setLoading(true);
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/api/admin/getcontest');
                if (response.data.success) {
                    setContests(response.data.contests);
                    if (response.data.contests.length > 0) {
                        setSelectedContest(response.data.contests[0].contestName); // Set first contest as default
                    }
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching contests:', error);
                setError('Error fetching contests');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
        fetchContests();
    }, []);

    useEffect(() => {
        const fetchContestants = async () => {
            if (selectedContest) {
                setLoading(true);
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getcontestants/${selectedContest}`);
                    if (response.data.success) {
                        setContestants(response.data.contestants);
                    } else {
                        setError(response.data.message);
                    }
                } catch (error) {
                    console.error('Error fetching contestants:', error);
                    setError('Error fetching contestants');
                } finally {
                    setLoading(false);
                }
            } else {
                setContestants([]); 
            }
        };

        fetchContestants();
    }, [selectedContest]);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Excel
    const handleUpload = (newStudents) => {
        const updatedStudents = newStudents.map(student => ({
            ...student,
            attendance: student.attendance || 'Vắng mặt' // Default value if not present
        }));
        setStudents([...students, ...updatedStudents]);
        alert('Danh sách sinh viên đã được cập nhật từ file Excel.');
    };

    const handleOpenExcelModal = () => {
        setIsExcelModalOpen(true); // Open the Excel modal
    };

    const handleCloseExcelModal = () => {
        setIsExcelModalOpen(false); // Close the Excel modal
    };

    return (
        <div className="main-content">
            <div className="d-flex justify-content-between">
                <div className="flex-fill me-2">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Danh sách tất cả sinh viên</h4>
                        <div  className="d-flex align-items-center">
                            <button 
                                className="btn btn-success btn-sm d-flex align-items-center mt-1" 
                                type="button" 
                                style={{ padding: '5px 11px' }} 
                                onClick={handleOpenExcelModal}
                            >
                            <PiMicrosoftExcelLogoFill style={{ fontSize: '16px', marginRight: '4px' }}/> 
                                Excel
                            </button>
                        </div>
                    </div>
                    <div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col" className="text-center">#</th>
                                    <th scope="col" className="text-center">SBD</th>
                                    <th scope="col" className="text-center">Tên Sinh Viên</th>
                                    <th scope="col" className="text-center">Bảng/Khối</th>
                                    <th scope="col" className="text-center">Điểm danh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.studentid}>
                                        <td className="text-center align-middle">{index + 1}</td>
                                        <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.studentid}</td>
                                        <td className="text-center align-middle">{student.studentname}</td>
                                        <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.studentunit}</td>
                                        <td className="text-center align-middle">{student.attendance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex-fill ms-2">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Danh sách sinh viên tham dự cuộc thi</h4>
                        <div className="d-flex align-items-center">
                            <label htmlFor="contestSelect" className="form-label mb-0 me-2">Chọn cuộc thi:</label>
                            <select
                                style={{ width: '150px' }} 
                                id="contestSelect"
                                className="form-select"
                                value={selectedContest}
                                onChange={(e) => setSelectedContest(e.target.value)}
                            >
                                <option value=""></option>
                                {contests.map((contest) => (
                                    <option key={contest.contestName} value={contest.contestName}>
                                        {contest.contestName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">#</th>
                                <th scope="col" className="text-center">SBD</th>
                                <th scope="col" className="text-center">Tên Sinh Viên</th>
                                <th scope="col" className="text-center">Bảng/Khối</th>
                                <th scope="col" className="text-center">Tên cuộc thi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contestants.length > 0 ? (
                                contestants.map((student, index) => (
                                    <tr key={student.studentid}>
                                        <td className="text-center align-middle">{index + 1}</td>
                                        <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.studentid}</td>
                                        <td className="text-center align-middle">{student.studentname}</td>
                                        <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.studentunit}</td>
                                        <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.contestName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">Không có sinh viên tham dự</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isExcelModalOpen && 
                <ExcelUploadModal 
                    onClose={handleCloseExcelModal} 
                    onUpload={handleUpload} 
                />
            }
        </div>
    );
};

export default StudentList;