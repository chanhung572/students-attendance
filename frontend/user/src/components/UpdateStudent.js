import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const UpdateStudent = ({ student, onClose, onUpdate }) => {
    const [studentname, setStudentName] = useState('');
    const [studentid, setStudentId] = useState('');
    const [studentunit, setStudentUnit] = useState('');

    useEffect(() => {
        if (student) {
            setStudentName(student.studentname);
            setStudentId(student.studentid);
            setStudentUnit(student.studentunit);
        }
    }, [student]);

    const handleUpdateStudent = () => {
        const updatedStudent = { 
            studentname, 
            studentid, 
            studentunit 
        };
        
        onUpdate(updatedStudent);
        clearInputs(); 
        onClose(); 
    };

    const clearInputs = () => {
        setStudentName('');
        setStudentId('');
        setStudentUnit('');
    };

    return (
        <Modal show={true} onHide={() => { clearInputs(); onClose(); }}>
            <Modal.Header closeButton>
                <Modal.Title>Cập Nhật Thông Tin Sinh Viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Tên Sinh Viên</label>
                    <input
                        type="text"
                        className="form-control"
                        value={studentname}
                        onChange={(e) => setStudentName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">SBD</label>
                    <input
                        type="text"
                        className="form-control"
                        value={studentid}
                        onChange={(e) => setStudentId(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Bảng/Khối</label>
                    <input
                        type="text"
                        className="form-control"
                        value={studentunit}
                        onChange={(e) => setStudentUnit(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { clearInputs(); onClose(); }}>Đóng</Button>
                <Button variant="primary" onClick={handleUpdateStudent}>Lưu Thay Đổi</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateStudent;