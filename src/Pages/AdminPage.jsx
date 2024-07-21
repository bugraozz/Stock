



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/AdminPage.css';

function AdminPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);

    const userRegistration = async (e) => {
        e.preventDefault();
        if (editUser) {
            updateUser(editUser.id);
        } else {
            try {
                const response = await axios.post('http://localhost:3001/register', { username, password, role });
                console.log('Kayıt başarılı:', response.data);
                localStorage.setItem('token', response.data.token);
                fetchUsers();
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
        } catch (err) {
            console.error('Kullanıcı güncellenemedi:', err);
        }
    };

    const editUserDetails = (user) => {
        setEditUser(user);
        setUsername(user.username);
        setRole(user.role);
        setPassword('');
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
            console.log('Kullanıcılar:', response.data);
        } catch (err) {
            console.error('Kullanıcılar getirilemedi:', err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className='admin-container'>
            <div className='row'>
                <div className='col-lg-6'>
                    <div className='admin-form'>
                        <h3>{editUser ? 'Kullanıcı Güncelle' : 'Kullanıcı Ekle'}</h3>
                        <form onSubmit={userRegistration}>
                            <input 
                                type='text' 
                                className='form-input' 
                                placeholder='Kullanıcı Adı' 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required
                            />
                            <input 
                                type='password' 
                                className='form-input' 
                                placeholder='Şifre' 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                            <select 
                                className='form-input' 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)} 
                                required
                            >
                                <option value='admin'>Admin</option>
                                <option value='user'>User</option>
                                <option value='executive'>Executive</option>
                            </select>
                            <div className='d-flex'>
                                <button className='admin-btn' type='submit'>
                                    {editUser ? 'Kullanıcı Güncelle' : 'Kullanıcı Ekle'}
                                </button>
                                {editUser && 
                                    <button 
                                        className='cancel-btn' 
                                        type='button' 
                                        onClick={resetForm}
                                    >
                                        İptal
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='user-list'>
                        <h2>Kullanıcı Listesi</h2>
                        <ul>
                            {users.map(user => (
                                <li key={user.id}>
                                    {user.username} - {user.role}
                                    <div>
                                        <button 
                                            className='edit-btn' 
                                            onClick={() => editUserDetails(user)}
                                        >
                                            Düzenle
                                        </button>
                                        <button 
                                            className='delete-btn' 
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;

