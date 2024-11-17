



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function AdminPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const userRegistration = async (e) => {
        e.preventDefault();
        if (editUser) {
            await updateUser(editUser.id);
        } else {
            try {
                const response = await axios.post('http://localhost:3001/register', { username, password, role });
                console.log('Kayıt başarılı:', response.data);
                localStorage.setItem('token', response.data.token);
                fetchUsers();
                resetForm();
                setShowForm(false);
            } catch (err) {
                console.error('Kayıt başarısız:', err.response?.data || err.message);
            }
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchUsers();
        } catch (err) {
            console.error('Kullanıcı silinemedi:', err);
        }
    };

    const updateUser = async (id) => {
        try {
            await axios.put(`http://localhost:3001/users/${id}`, { username, password, role }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchUsers();
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error('Kullanıcı güncellenemedi:', err);
        }
    };

    const editUserDetails = (user) => {
        setEditUser(user);
        setUsername(user.username);
        setRole(user.role);
        setPassword(''); // Şifre alanını boş bırakıyoruz
        setShowForm(true);
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setRole('');
        setEditUser(null);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setUsers(response.data);
        } catch (err) {
            console.error('Kullanıcılar getirilemedi:', err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className=' min-h-screen p-10'>
            <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6'>
                <div className=' flex justify-between items-center mb-6'>
                    <h2 className='text-3xl font-semibold text-black '>USER MANAGEMENT</h2>
                    <button
                        className="btn btn-outline btn-default btn-sm  "
                        onClick={() => setShowForm(true) }
                    >
                        <FaUserPlus size={22} className='mr-1' />
                       
                    </button>
                   
                   
                </div>
               

                {/* Kullanıcı Listesi */}
                <div className='overflow-x-auto mt-4'>
                    <table className="table table-zebra w-full text-lg">
                        <thead>
                            <tr>
                                <th className='text-center px-5 py-3 font-bold'>Username</th>
                                <th className='text-center px-5 py-3 font-bold'>Role</th>
                                <th className='text-center px-5 py-3 font-bold'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className='text-center px-5 py-3 text-sm'>{user.username}</td>
                                    <td className='text-center px-5 py-3 text-sm'>{user.role}</td>
                                    <td className='text-center px-5 py-3 text-sm'>
                                        <button 
                                            className="btn btn-sm btn-warning mr-2"
                                            onClick={() => editUserDetails(user)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className='btn btn-sm btn-danger'
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="3" className='py-4 text-center text-gray-500'>No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                        <div className='bg-white w-96 md:w-1/3 p-8 rounded-lg shadow-lg relative'>
                            <button
                                className="btn btn-circle btn-sm absolute top-2 right-2"
                                onClick={() => { resetForm(); setShowForm(false); }}
                            >
                                <IoClose size={22}/>
                            </button>
                            <h3 className='text-xl font-semibold mb-6'>{editUser ? 'Edit User' : 'Add User'}</h3>
                            <form onSubmit={userRegistration} className='space-y-4'>
                                <input 
                                    type='text' 
                                    className='input input-bordered w-full'
                                    placeholder='Username' 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required
                                />
                                <input 
                                    type='password' 
                                    className='input input-bordered w-full'
                                    placeholder='Password' 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required={!editUser} 
                                />
                                <select 
                                    className='select select-bordered w-full'
                                    value={role} 
                                    onChange={(e) => setRole(e.target.value)} 
                                    required
                                >
                                    <option value=''>Choose Role</option>
                                    <option value='admin'>Admin</option>
                                    <option value='user'>User</option>
                                    <option value='executive'>Executive</option>
                                </select>
                                <div className='flex space-x-4'>
                                    <button 
                                        className="btn btn-primary btn-sm "
                                        value='submit'
                                    >
                                        {editUser ? 'Update' : 'Add'}
                                    </button>
                                    {editUser && 
                                        <button 
                                            className="btn btn-ghost btn-sm "
                                            type='button' 
                                            onClick={() => { resetForm(); setShowForm(false); }}
                                        >
                                            Cancel
                                        </button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
