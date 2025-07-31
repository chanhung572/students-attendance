import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const StudentListModal = ({ contestName, onClose }) => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            if (!contestName) return; 

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getcontestants/${contestName}`);
                if (response.data.success) {
                    setStudents(response.data.contestants); 
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setError('Error fetching students');
            }
        };

        fetchStudents();
    }, [contestName]);

    const handleDelete = async (studentid) => {
        try {
            const response = await axios.delete(process.env.REACT_APP_API_URL + '/api/deletestudentfromcontest', { 
                data: { studentid, contestName }
            });
            if (response.data.success) {
                setStudents(students.filter(student => student.studentid !== studentid));
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            setError('Error deleting student');
        }
    };

    return (
        <Modal isOpen={!!contestName} onRequestClose={onClose} 
            style={{
                content: {
                    top: '165px', 
                    left: '50%',
                    marginRight: '-54%',
                    transform: 'translate(-54%, 0)',
                    maxWidth: '1300px', 
                    borderRadius: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                },
            }}>
            <div className="d-flex justify-content-between align-items-center">
                <h4>Danh Sách Sinh Viên Tham Dự Cuộc Thi: {contestName}</h4>
                <button className="btn btn-outline-danger" style={{ marginTop:'-15px'}} onClick={onClose}>
                    <IoMdClose style={{ fontSize: '15px'}}/>
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table small-table"> 
                <thead>
                    <tr>
                        <th scope="col" style={{ textAlign: 'center' }}>#</th>
                        <th scope="col" style={{ textAlign: 'center' }}>SBD</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Tên Sinh Viên</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Bảng/Khối</th>
                        <th scope="col" style={{ textAlign: 'center' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <tr key={student.studentid}>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ textAlign: 'center', textTransform: 'uppercase' }}>{student.studentid}</td>
                                <td style={{ textAlign: 'center', textTransform: 'uppercase' }}>{student.studentname}</td>
                                <td style={{ textAlign: 'center', textTransform: 'uppercase' }}>{student.studentunit}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(student.studentid)}>
                                        <MdDelete style={{ fontSize: '20px' }}/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>Không có sinh viên nào tham gia cuộc thi này.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Modal>
    );
};

export default StudentListModal;