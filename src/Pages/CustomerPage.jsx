



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/AdminPage.css';

function CustomerPage() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [editCustomer, setEditCustomer] = useState(null);

    const CustomerRegistration = async (e) => {
        e.preventDefault();
        if (editCustomer) {
            updateCustomer(editCustomer.id);
        } else {
            try {
                const response = await axios.post('http://localhost:3001/customers', { name, address, phone, email });
                console.log('Kayıt başarılı:', response.data);
                localStorage.setItem('token', response.data.token);
                fetchCustomer();
            } catch (err) {
                console.error('Kayıt başarısız:', err.response?.data || err.message);
            }
        }
    };

    const deleteCustomer = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/customers/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchCustomer();
        } catch (err) {
            console.error('Müşteri silinemedi:', err);
        }
    };

    const updateCustomer = async (id) => {
        try {
            await axios.put(`http://localhost:3001/customers/${id}`, { name, address, phone, email }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchCustomer();
            resetForm();
        } catch (err) {
            console.error('Kullanıcı güncellenemedi:', err);
        }
    };

    const editCustomerDetails = (user) => {
        setEditCustomer(user);
        setName(user.name);
        setAddress(user.address);
        setPhone(user.phone);
        setEmail(user.email);
    };

    const resetForm = () => {
        setName('');
        setAddress('');
        setPhone('');
        setEmail('');
        setEditCustomer(null);
    };

    const fetchCustomer = async () => {
        try {
            const response = await axios.get('http://localhost:3001/customers', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setUsers(response.data);
            console.log('Kullanıcılar:', response.data);
        } catch (err) {
            console.error('Kullanıcılar getirilemedi:', err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    return (
        <div className='admin-container'>
            <div className='row'>
                <div className='col-lg-6'>
                    <div className='admin-form'>
                        <h3>{editCustomer ? 'Customer Edit' : 'Customer Add'}</h3>
                        <form onSubmit={CustomerRegistration}>
                            <input 
                                type='text' 
                                className='form-input' 
                                placeholder='Customer Name' 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required
                            />
                            <input 
                                type='text' 
                                className='form-input' 
                                placeholder='address'
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                required
                            />
                           <input
                                type='text'
                                className='form-input'
                                placeholder='phone'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                            <input
                                type='text'
                                className='form-input'
                                placeholder='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <div className='d-flex'>
                                <button className='admin-btn' type='submit'>
                                    {editCustomer ? 'Customer Edit' : 'Customer Add'}
                                </button>
                                {editCustomer && 
                                    <button 
                                        className='cancel-btn' 
                                        type='button' 
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='user-list'>
                        <h2>Customers List</h2>
                        <ul>
                            {users.map(user => (
                                <li key={user.id}>
                                    {user.name} - {user.address} - {user.phone} - {user.email}
                                    <div>
                                        <button 
                                            className='edit-btn' 
                                            onClick={() => editCustomerDetails(user)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className='delete-btn' 
                                            onClick={() => deleteCustomer(user.id)}
                                        >
                                            Delete
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

export default CustomerPage;

