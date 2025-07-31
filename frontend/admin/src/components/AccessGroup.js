import React, { useEffect, useState } from 'react';
import '../style/Content.css';

const AccessGroup = () => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState({ role: '', description: '' });
    const [isUpdating, setIsUpdating] = useState(false); 
    const [currentRoleId, setCurrentRoleId] = useState(null); 
    const [showInput, setShowInput] = useState(false); 

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/api/admin/getroles'); 
        const data = await response.json();
        setRoles(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(process.env.REACT_APP_API_URL + '/api/admin/addroles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRole),
        });
        if (response.ok) {
            fetchRoles(); 
            resetForm(); 
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/updaterole/${currentRoleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRole),
        });
        if (response.ok) {
            fetchRoles(); 
            resetForm(); 
        } else {
            const errorData = await response.json();
            alert(errorData.message); 
        }
    };

    const resetForm = () => {
        setNewRole({ role: '', description: '' });
        setShowInput(false);
        setIsUpdating(false);
        setCurrentRoleId(null);
    };

    const handleEdit = (role) => {
        if (isUpdating && currentRoleId === role.id) {
            resetForm();
        } else {
            setNewRole({ role: role.role, description: role.description });
            setCurrentRoleId(role.id);
            setIsUpdating(true);
            setShowInput(true);
        }
    };

    return (
        <div className="main-content">
            <h5>Nhóm quyền</h5>
            <button className="btn btn-secondary btn-sm" style={{ marginBottom: '5px' }} onClick={() => setShowInput(!showInput)}>
                {showInput ? '-' : '+'}
            </button>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col" className="text-center align-middle">#</th>
                        <th scope="col" className="text-center align-middle">Vai trò</th>
                        <th scope="col" className="text-center align-middle">Mô tả</th>
                        <th scope="col" className="text-center align-middle">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role, index) => (
                        <tr key={role.id}>
                            <th scope="row" className="text-center align-middle">{index + 1}</th>
                            <td className="text-center align-middle">{role.role}</td>
                            <td>{role.description}</td>
                            <td className="text-center align-middle">
                                <button className="btn btn-primary btn-sm" onClick={() => handleEdit(role)}>
                                    {isUpdating && currentRoleId === role.id ? 'Hủy' : 'Sửa'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {showInput && (
                        <tr>
                            <td className="text-center align-middle" colSpan="1">
                                <button className="btn btn-secondary btn-sm" type="button" onClick={isUpdating ? handleUpdate : handleSubmit}>
                                    {isUpdating ? 'Update' : 'Add'}
                                </button>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newRole.role}
                                    onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                                    placeholder="Vai trò"
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newRole.description}
                                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                    placeholder="Mô tả"
                                    required
                                />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AccessGroup;