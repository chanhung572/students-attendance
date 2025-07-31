import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import { FaUserGraduate } from "react-icons/fa";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 12; 

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + '/api/getstudents');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Error fetching students');
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(students.length / studentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="rounded-start-4 container" style={{ height: '88vh', backgroundColor: '#E8E8E8' }}>
            <h5 style={{ paddingBottom: '35px' }}>Danh Sách Sinh Viên <FaUserGraduate className='me-1 mb-1'/></h5>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '3px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">#</th>
                                <th scope="col" className="text-center">SBD</th>
                                <th scope="col" className="text-center">Tên Sinh Viên</th>
                                <th scope="col" className="text-center">Bảng/Khối</th>
                                <th scope="col" className="text-center">Điểm Danh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.map((student, index) => (
                                <tr key={student.studentid}>
                                    <td className="text-center align-middle">{index + 1 + indexOfFirstStudent}</td>
                                    <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.studentid}</td>
                                    <td className="text-center align-middle">{student.studentname}</td>
                                    <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.studentunit}</td>
                                    <td className="text-center align-middle">{student.attendance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="d-flex justify-content-center align-items-center my-4">
                <button className="btn btn-outline-secondary me-2" onClick={handlePrevPage} disabled={currentPage === 1} aria-label="Previous Page">
                    <GrFormPrevious />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="btn btn-outline-secondary ms-2" onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="Next Page">
                    <GrFormNext />
                </button>
            </div>
        </div>
    );
};

export default StudentList;