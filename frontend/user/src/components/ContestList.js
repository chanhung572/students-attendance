import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateContest from './UpdateContest';
import StudentListModal from './StudentListModal';
import ImageModal from './ImageModal';
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { RiFileList2Fill } from "react-icons/ri";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { IoImages } from "react-icons/io5";

const ContestList = () => {
    const [contests, setContests] = useState([]);
    const [selectedContest, setSelectedContest] = useState(null);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const contestsPerPage = 12;

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/api/getcontest');
                if (response.data.success) {
                    setContests(response.data.contests);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching contests:', error);
                setError('Error fetching contests');
            }
        };
        fetchContests();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12; // Convert to 12-hour format
        hours = hours ? String(hours) : '12'; // If hour is 0, set it to 12

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    const indexOfLastContest = currentPage * contestsPerPage;
    const indexOfFirstContest = indexOfLastContest - contestsPerPage;
    const currentContests = contests.slice(indexOfFirstContest, indexOfLastContest);
    const totalPages = Math.ceil(contests.length / contestsPerPage);

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

    const handleDeleteContest = async (contestName) => {
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa cuộc thi "${contestName}"?`);
        if (!confirmDelete) return;

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/api//deletecontest', { contestName });
            alert(response.data.message);
            const updatedResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/getcontest');
            if (updatedResponse.data.success) {
                setContests(updatedResponse.data.contests);
            } else {
                setError(updatedResponse.data.message);
            }
        } catch (error) {
            console.error('Lỗi khi xóa cuộc thi:', error);
            setError('Lỗi khi xóa cuộc thi');
        }
    };

    const handleOpenStudentModal = (contestName) => {
        setSelectedContest(contestName);
        setIsStudentModalOpen(true);
    };

    const handleCloseStudentModal = () => {
        setIsStudentModalOpen(false);
        setSelectedContest(null);
    };

    const handleOpenModal = (contest) => {
        setSelectedContest(contest);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContest(null);
    };

    const handleUpdateContest = async (updatedContest) => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/api/updatecontest', updatedContest);
            alert(response.data.message);
            const updatedResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/getcontest');
            if (updatedResponse.data.success) {
                setContests(updatedResponse.data.contests);
            } else {
                setError(updatedResponse.data.message);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật cuộc thi:', error);
            setError('Lỗi khi cập nhật cuộc thi');
        }
    };

    const handleOpenImageModal = (contest) => {
        const safeImageUrl = contest.image ? contest.image : 'path/to/default/image.jpg';
        setSelectedImage(safeImageUrl);
        setIsImageModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <div className="rounded-start-4 container" style={{ height: '88vh', backgroundColor: '#E8E8E8' }}>
            <h5 style={{ paddingBottom: '35px' }}>Danh Sách Cuộc Thi <RiFileList2Fill className='me-1 mb-1'/></h5>
            <div style={{ backgroundColor: 'white', borderRadius: '3px', padding: '20px 20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                {error && <div className="alert alert-danger">{error}</div>}
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" style={{ textAlign: 'center' }}>Tên Cuộc Thi</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Mô Tả</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Ngày Bắt Đầu</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Ngày Kết Thúc</th>
                            <th scope="col" style={{ textAlign: 'center' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentContests.map((contest, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{contest.contestName}</td>
                                <td style={{ textAlign: 'center' }}>{contest.description}</td>
                                <td style={{ textAlign: 'center' }}>{formatDate(contest.startDateTime)}</td>
                                <td style={{ textAlign: 'center' }}>{formatDate(contest.endDateTime)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="btn btn-outline-success btn-sm me-2" onClick={() => handleOpenImageModal(contest)}>
                                        <IoImages style={{ fontSize: '20px' }} />
                                    </button>
                                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleOpenStudentModal(contest.contestName)}>
                                        <FaEye style={{ fontSize: '20px' }} />
                                    </button>
                                    <button className="btn btn-outline-warning btn-sm me-2" onClick={() => handleOpenModal(contest)}>
                                        <BiSolidEditAlt style={{ fontSize: '20px' }} />
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteContest(contest.contestName)}>
                                        <MdDelete style={{ fontSize: '20px' }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && 
                    <UpdateContest
                        contest={selectedContest}
                        onClose={handleCloseModal}
                        onUpdate={handleUpdateContest}
                    />
                }

                {isStudentModalOpen && 
                    <StudentListModal
                        contestName={selectedContest}
                        onClose={handleCloseStudentModal}
                    />
                }

                {isImageModalOpen && 
                    <ImageModal
                        imageUrl={selectedImage}
                        onClose={handleCloseImageModal}
                    />
                }
            </div>

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

export default ContestList;