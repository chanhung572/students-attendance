import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const ImageModal = ({ imageUrl, onClose }) => {
    return (
        <Modal show={!!imageUrl} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Hình Ảnh</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {imageUrl ? (
                    <img src={imageUrl} alt="Contest" style={{ width: '100%' }} />
                ) : (
                    <p>Không có hình ảnh nào để hiển thị.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageModal;