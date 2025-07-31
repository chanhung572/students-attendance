import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const ContestListModal = ({ students, onClose }) => {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState('');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + '/api/getcontest');
        if (response.data.success) {
          setContests(response.data.contests);
        } else {
          console.error('Không thể tải cuộc thi:', response.data.message);
        }
      } catch (error) {
        console.error('Lỗi khi tải cuộc thi:', error);
      }
    };
    fetchContests();
  }, []);

  const handleAssign = async () => {
    if (!selectedContest) {
      alert('Vui lòng chọn cuộc thi');
      return;
    }

    if (!students || students.length === 0) {
      alert('Không có dữ liệu sinh viên để gán cuộc thi');
      return;
    }

    try {
      await Promise.all(
        students.map(async (stu) => {
          const response = await axios.post(process.env.REACT_APP_API_URL + '/api/addcontestant', {
            studentid: stu.studentid,
            studentname: stu.studentname,
            studentunit: stu.studentunit,
            contestName: selectedContest,
          });
          console.log('Response:', response.data);
        })
      );

      alert(`Đã thêm tất cả vào cuộc thi "${selectedContest}" cho ${students.length} sinh viên!`);
      onClose(); 
    } catch (error) {
      console.error('Lỗi khi chỉ định sinh viên:', error);
      alert(error.response?.data?.message || 'Vui lòng thử lại.');
    }
  };

  if (!students || students.length === 0) {
    return (
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Không có dữ liệu sinh viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Chưa có thông tin sinh viên để gán cuộc thi.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {students.length === 1
            ? `Thêm sinh viên ${students[0].studentname} vào cuộc thi`
            : `Thêm ${students.length} sinh viên vào cuộc thi`
          }
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {students.length === 1 && (
          <p>Đang thêm sinh viên: {students[0].studentname}</p>
        )}
        {students.length > 1 && (
          <ul>
            {students.map((stu) => (
              <li key={stu.studentid}>
                {stu.studentid} - {stu.studentname}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3">
          <label>Vui lòng chọn cuộc thi:</label>
          <select
            className="form-select mt-2"
            value={selectedContest}
            onChange={(e) => setSelectedContest(e.target.value)}
          >
            <option value="">-- Chọn cuộc thi --</option>
            {contests.map((contest) => (
              <option key={contest.contestName} value={contest.contestName}>
                {contest.contestName}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleAssign}>
          Thêm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContestListModal;
