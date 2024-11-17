



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiX } from 'react-icons/fi';

function CustomerPage() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [editCustomer, setEditCustomer] = useState(null);
    const [showForm, setShowForm] = useState(false);

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
                resetForm();
                setShowForm(false);
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
            setShowForm(false);
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
        setShowForm(true);
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
        <div className='overflow-x-auto min-h-screen  p-10'>
            <div className='container mx-auto'>
               
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-4xl font-semibold'>Customers List</h2>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowForm(true)}
                    >
                        <FiPlus className='mr' />
                    </button>
                </div>

                {/* Müşteri Listesi */}
                
                    <div className='overflow-x-auto border border-black-300 rounded-lg shadow-md'>
                        <table className='table table-zebra '>
                            <thead>
                                <tr> 
                                   
                                    <th className='py-2 px-4 border-b text-center '>Name</th>
                                    <th className='py-2 px-4 border-b text-center '>Address</th>
                                    <th className='py-2 px-4 border-b text-center '>Telephone</th>
                                    <th className='py-2 px-4 border-b text-center '>Email</th>
                                    <th className='py-2 px-4 border-b text-center '>transactions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className='text-center border-black-500'>
                                       
                                        <td className='py-2 px-4 border-b'>{user.name}</td>
                                        <td className='py-2 px-4 border-b'>{user.address}</td>
                                        <td className='py-2 px-4 border-b'>{user.phone}</td>
                                        <td className='py-2 px-4 border-b'>{user.email}</td>
                                        <td className='py-2 px-4 border-b space-x-2'>
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => editCustomerDetails(user)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn btn-info btn-sm"
                                                onClick={() => deleteCustomer(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className='py-4'>Customer not found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                

                {/* Modal: Müşteri Ekleme/Güncelleme Formu */}
                {showForm && (
                    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                        <div className='bg-white w-11/12 max-w-md p-6 rounded shadow-lg relative'>
                            <button
                                className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
                                onClick={() => { resetForm(); setShowForm(false); }}
                            >
                                <FiX size={24} />
                            </button>
                            <h3 className='text-xl font-semibold mb-4'>{editCustomer ? 'Customers Edit' : 'Add customers'}</h3>
                            <form onSubmit={CustomerRegistration} className='space-y-4'>
                                <input 
                                    type='text' 
                                    className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Customer name' 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required
                                />
                                <input 
                                    type='text' 
                                    className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Address' 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    required
                                />
                                <input
                                    type='text'
                                    className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Telephone'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <input
                                    type='email'
                                    className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <div className='flex space-x-4 mt-4'>
                                    <button 
                                        className="btn btn-success btn-sm"
                                        type='submit'
                                    >
                                        {editCustomer ? 'Edit' : 'Add'}
                                    </button>
                                    {editCustomer && 
                                        <button 
                                            className="btn btn-secondary btn-sm"
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

export default CustomerPage;



