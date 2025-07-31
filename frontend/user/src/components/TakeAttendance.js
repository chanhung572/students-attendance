import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import UpdateStudent from './UpdateStudent';
import ContestListModal from './ContestListModal';
import { BiSolidEditAlt } from "react-icons/bi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { FaUserCog } from "react-icons/fa";

const TakeAttendance = () => {
    const [studentname, setStudentName] = useState('');
    const [studentid, setStudentId] = useState('');
    const [studentunit, setStudentUnit] = useState('');
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceFilter, setAttendanceFilter] = useState('Tất cả'); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isContestModalOpen, setIsContestModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 6;
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [allChecked, setAllChecked] = useState(false);
    const [selectedStudentsForContest, setSelectedStudentsForContest] = useState([]); 

    useEffect(() => {
        fetchStudents();
    }, []);

    // Fetch all students
    const fetchStudents = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + '/api/getstudents');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Error fetching students');
        }
    };

    // Validate input fields
    const validateInputs = useCallback(() => {
        setError('');
        return studentname && studentid && studentunit;
    }, [studentname, studentid, studentunit]);

    // Add a new student
    const handleAddStudent = useCallback(async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        const studentExists = students.some(student => student.studentid.toLowerCase() === studentid.toLowerCase());
        if (studentExists) {
            setError("SBD đã tồn tại!");
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/api/addstudent', {
                studentname,
                studentid,
                studentunit,
                attendance: 'Vắng mặt' 
            });
            alert(response.data.message);
            setStudents([...students, { studentname, studentid, studentunit, attendance: 'Vắng mặt' }]);
            clearInputs();
        } catch (error) {
            console.error('Error adding student:', error);
            setError('Error: ' + error.message);
        }
    }, [studentname, studentid, studentunit, students, validateInputs]);

    // Delete selected students
    const handleDeleteSelectedStudents = async () => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sinh viên đã chọn?");
        if (!confirmDelete) return;
    
        try {
            await Promise.all([...selectedStudents].map(async (id) => {
                await axios.post(process.env.REACT_APP_API_URL + '/api/deletestudent', { studentid: id });
            }));
    
            // Cập nhật lại danh sách sinh viên
            setStudents(students.filter(student => !selectedStudents.has(student.studentid)));
            setSelectedStudents(new Set()); 
            setAllChecked(false);
    
            // Hiện thông báo xóa thành công một lần
            alert('Đã xóa sinh viên đã chọn thành công.');
        } catch (error) {
            console.error('Error deleting selected students:', error);
            setError('Error deleting selected students');
        }
    };

    // Delete all students
    const handleDeleteAllStudents = useCallback(async () => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tất cả sinh viên?");
        if (!confirmDelete) return;

        try {
            await axios.post(process.env.REACT_APP_API_URL + '/api/deleteallstudents');
            setStudents([]);
            alert('Đã xóa tất cả sinh viên.');
        } catch (error) {
            console.error('Error deleting all students:', error);
            setError('Error deleting all students');
        }
    }, []);

    // Open the modal for updating a student
    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        clearInputs();
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    // Update a student
    const handleUpdateStudent = async (updatedStudent) => {
        const studentExists = students.some(student =>
            student.studentid.toLowerCase() === updatedStudent.studentid.toLowerCase() &&
            student.studentid !== selectedStudent.studentid 
        );

        if (studentExists) {
            setError("SBD đã tồn tại!");
            return; 
        }

        try {
            const response = await axios.put(process.env.REACT_APP_API_URL + '/api/updatestudent', updatedStudent);
            alert(response.data.message);
            setStudents(students.map(s => 
                s.studentid === selectedStudent.studentid ? { ...s, ...updatedStudent } : s 
            ));
            handleCloseModal(); 
        } catch (error) {
            console.error('Error updating student:', error);
            setError('Error: ' + error.message); 
        }
    };

    const toggleAttendance = async (student) => {
        const newAttendance = student.attendance === 'Vắng mặt' ? 'Có mặt' : 'Vắng mặt';
        try {
            const response = await axios.put(process.env.REACT_APP_API_URL + '/api/updatestudent', {
                studentid: student.studentid,
                studentname: student.studentname,
                studentunit: student.studentunit,
                attendance: newAttendance
            });
            alert(response.data.message);
            
            // Cập nhật danh sách sinh viên
            setStudents(students.map(s => 
                s.studentid === student.studentid ? { ...s, attendance: newAttendance } : s 
            ));
    
            // Xóa thông tin đã nhập vào ô tìm kiếm
            setSearchTerm('');
        } catch (error) {
            console.error('Error updating attendance:', error);
            setError('Error: ' + error.message);
        }
    };

    // Clear input fields
    const clearInputs = () => {
        setStudentName('');
        setStudentId('');
        setStudentUnit('');
    };

    // Handle search input change
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

    const filteredStudents = students.filter(student => {
        const matchesSearchTerm = (student.studentname && student.studentname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                  (student.studentid && student.studentid.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesAttendanceFilter = attendanceFilter === 'Tất cả' || student.attendance === attendanceFilter;
        return matchesSearchTerm && matchesAttendanceFilter;
    });
    
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    // Pagination control functions
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Close contest modal
    const handleCloseContestModal = () => {
        setIsContestModalOpen(false);
        setSelectedStudent(null);
    };

    // Handle checkbox selection
    const handleCheckboxChange = (studentId) => {
        const updatedSelectedStudents = new Set(selectedStudents);
        if (updatedSelectedStudents.has(studentId)) {
            updatedSelectedStudents.delete(studentId);
        } else {
            updatedSelectedStudents.add(studentId);
        }
        setSelectedStudents(updatedSelectedStudents);
    };

    const handleSelectAllChange = () => {
        let newSelected;
        if (!allChecked) {
          newSelected = new Set(students.map((s) => s.studentid));
          setAllChecked(true);
        } 
        else {
          newSelected = new Set();
          setAllChecked(false);
        }
        setSelectedStudents(newSelected);
    };
    const handleOpenMultipleContestModal = () => {
    const selectedData = students.filter((stu) => selectedStudents.has(stu.studentid));
      
        if (selectedData.length === 0) {
          alert("Bạn chưa chọn sinh viên nào!");
          return;
        }
      
        setSelectedStudentsForContest(selectedData);
        setIsContestModalOpen(true);
    };

    return (
        <div className="rounded-start-4 container" style={{ height: '88vh', backgroundColor: '#E8E8E8' }}>
            <h5 style={{ paddingBottom: '35px' }}>Quản Lí Sinh Viên <FaUserCog className='me-1 mb-1'/></h5>
            <div style={{ backgroundColor: 'white', borderRadius: '3px', padding: '20px 20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>       
                <form onSubmit={handleAddStudent}>
                    <h5>Điểm danh Sinh Viên</h5>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Tìm kiếm thông tin"
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center align-middle">#</th>
                                <th scope="col" className="text-center align-middle">SBD</th>
                                <th scope="col" className="text-center align-middle">Tên Sinh Viên</th>
                                <th scope="col" className="text-center align-middle">Bảng/Khối</th>
                                <th scope="col" className="text-center align-middle">Điểm Danh</th>
                                <th scope="col" className="text-center align-middle"></th>
                                <th scope="col" className="text-center align-middle"></th>
                                <th scope="col" className="text-center align-middle"></th>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập SBD sinh viên"
                                        value={studentid}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddStudent(e)} 
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập tên sinh viên"
                                        value={studentname}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddStudent(e)} 
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập Bảng/Khối sinh viên"
                                        value={studentunit}
                                        onChange={(e) => setStudentUnit(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddStudent(e)} 
                                    />
                                </td>
                                <td>
                                    <div className="d-flex justify-content-center">
                                        <select 
                                            className="form-select"
                                            style={{ width: '100px '}}
                                            value={attendanceFilter}
                                            onChange={(e) => setAttendanceFilter(e.target.value)}
                                        >
                                            <option value="Tất cả">Tất cả</option>
                                            <option value="Có mặt">Có mặt</option>
                                            <option value="Vắng mặt">Vắng mặt</option>
                                        </select>
                                    </div>
                                </td>
                                <td></td>
                                <td  >
                                    <div className="text-center align-middle">
                                        <button 
                                            className="btn btn-outline-danger btn-sm" 
                                            style={{ padding: '5px 11px' }} 
                                            type="button" 
                                            onClick={handleDeleteAllStudents}
                                        >
                                            Delete All
                                        </button>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.map((student, index) => (
                                <tr key={student.studentid}>
                                    <td className="text-center align-middle">{index + 1 + (currentPage - 1) * studentsPerPage}</td>
                                    <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.studentid}</td>
                                    <td className="text-center align-middle">{student.studentname}</td>
                                    <td className="text-center align-middle" style={{ textTransform: 'uppercase' }}>{student.studentunit}</td>
                                    <td className="text-center align-middle">
                                        <button className={`btn btn-${student.attendance === 'Có mặt' ? 'success' : 'secondary'} btn-sm`} onClick={() => toggleAttendance(student)}>
                                            {student.attendance}
                                        </button>
                                    </td>
                                    <td></td>
                                    <td className="text-center align-middle">
                                        <button className="btn btn-outline-warning btn-sm me-2" onClick={() => handleOpenModal(student)}>
                                            <BiSolidEditAlt style={{ fontSize: '20px' }} />
                                        </button>
                                    </td>
                                    <td  className="text-center align-middle">
                                        <div className="form-check" style={{ marginTop: '4px', marginLeft: '13px' }}>
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={selectedStudents.has(student.studentid)} 
                                                onChange={() => handleCheckboxChange(student.studentid)} 
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', marginRight: 20 }}>
                                    <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={handleSelectAllChange}
                                    style={{ marginRight: '5px' }}
                                    />
                                     <label>{allChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}</label>
                                </div>

                                {/* Nút mở modal contest cho nhiều sinh viên */}
                                <button 
                                    className="btn btn-primary me-2"
                                    onClick={handleOpenMultipleContestModal}
                                >
                                    Thêm vào cuộc thi
                                </button>

                                {/* Nút "Xoá đã chọn" (đã có sẵn) */}
                                <button 
                                    className="btn btn-danger"
                                    onClick={handleDeleteSelectedStudents}
                                >
                                    Xoá đã chọn
                                </button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </form>

                {isContestModalOpen && 
                    <ContestListModal
                    students={selectedStudentsForContest}  // một mảng
                    onClose={handleCloseContestModal}
                  />
                  
                }
                
                {isModalOpen && 
                    <UpdateStudent 
                        student={selectedStudent} 
                        onClose={handleCloseModal} 
                        onUpdate={handleUpdateStudent} 
                    />
                }
            </div>

            <div className="d-flex justify-content-center align-items-center my-4">
                <button className="btn btn-outline-secondary me-2" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <GrFormPrevious />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="btn btn-outline-secondary ms-2" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <GrFormNext />
                </button>
            </div>
        </div>
    );
};

export default TakeAttendance;