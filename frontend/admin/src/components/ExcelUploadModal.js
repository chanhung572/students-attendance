import React from 'react';
import UploadExcel from './UploadExcel';

const ExcelUploadModal = ({ onClose, onUpload }) => {
    return (
        <div class="modal" tabindex="-1" style={{ display: 'block', marginTop:'-20px'}} >
            <div class="modal-dialog" role="document" >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">UploadExcel</h5>
                    </div>
                    <div className="modal-body">
                        <UploadExcel onUpload={onUpload} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploadModal;