



import axios from "axios";
import React, { useState, useEffect } from "react";
import '../Styles/StockPage.css';
import { Modal, Button, Form } from 'react-bootstrap';

const StockPage = () => {
    const [stocks, setStocks] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [formData, setFormData] = useState({
        Product_Number: '',
        Product_Name: '',
        Quantity: '',
        Category: '',
        PurchasePrice: '',
        Supplier: '',
    });
    const [searchProductNumber, setSearchProductNumber] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        StockList();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const showFormHandler = (stock = {}) => {
        setShowForm(true);
        setIsEditMode(!!stock.Product_Number);
        setFormData({
            Product_Number: stock.Product_Number || '',
            Product_Name: stock.Product_Name || '',
            Quantity: stock.Quantity || '',
            Category: stock.Category || '',
            PurchasePrice: stock.PurchasePrice || '',
            Supplier: stock.Supplier || '',
        });
    };

    const handleClose = () => {
        setShowForm(false);
        setIsEditMode(false);
    };

    const stockAddHandler = (event) => {
        event.preventDefault();
        const newStock = { ...formData };

        axios.post('http://localhost:3001/stock', newStock)
            .then(response => {
                setStocks((prevState) => [...prevState, { ...newStock, id: response.data.id }]);
                setFormData({
                    Product_Number: '',
                    Product_Name: '',
                    Quantity: '',
                    Category: '',
                    PurchasePrice: '',
                    SellingPrice: '',
                    Supplier: '',
                });
                handleClose();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const stockUpdateHandler = (event) => {
        event.preventDefault();
        const updatedStock = { ...formData };

        axios.put(`http://localhost:3001/stock/${formData.Product_Number}`, updatedStock)
            .then(response => {
                const updatedStocks = stocks.map(stock =>
                    stock.Product_Number === formData.Product_Number ? { ...updatedStock, id: response.data.id } : stock
                );
                setStocks(updatedStocks);
                setFormData({
                    Product_Number: '',
                    Product_Name: '',
                    Quantity: '',
                    Category: '',
                    PurchasePrice: '',
                    Supplier: '',
                  
                });
                handleClose();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const stockDeleteHandler = (Product_Number) => {
        return (event) => {
            event.preventDefault();

            axios.delete(`http://localhost:3001/stock/${Product_Number}`)
                .then(response => {
                    const remainingStocks = stocks.filter(stock => stock.Product_Number !== Product_Number);
                    setStocks(remainingStocks);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        };
    };

    const stockSearchHandler = (event) => {
        event.preventDefault();

        axios.get(`http://localhost:3001/stock/${searchProductNumber}`)
            .then(response => {
                console.log('Search response:', response.data);
                setSearchResults([response.data]);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const StockList = () => {
        axios.get('http://localhost:3001/stock')
            .then(response => {
                setStocks(response.data);   
                setSearchResults([]);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const displayStocks = searchResults.length > 0 ? searchResults : stocks;

    return (
        <div className="stock-container">
            <button className="add-btn" onClick={() => showFormHandler()}>Add Stock</button>
            <Modal show={showForm} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Stock' : 'Add Stock'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={isEditMode ? stockUpdateHandler : stockAddHandler}>
                        <Form.Group>
                            <Form.Label>Product Number:</Form.Label>
                            <Form.Control type="text" name="Product_Number" value={formData.Product_Number} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Product Name:</Form.Label>
                            <Form.Control type="text" name="Product_Name" value={formData.Product_Name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Quantity:</Form.Label>
                            <Form.Control type="text" name="Quantity" value={formData.Quantity} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category:</Form.Label>
                            <Form.Control type="text" name="Category" value={formData.Category} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Purchase Price:</Form.Label>
                            <Form.Control type="text" name="PurchasePrice" value={formData.PurchasePrice} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Selling Price:</Form.Label>
                            <Form.Control type="text" name="SellingPrice" value={formData.SellingPrice} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Supplier:</Form.Label>
                            <Form.Control type="text" name="Supplier" value={formData.Supplier} onChange={handleChange} />
                        </Form.Group>
                      
                        <Button variant="primary" type="submit">
                            {isEditMode ? 'Update Stock' : 'Add Stock'}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
            <div className="stock-list-container">
                <form className="search-form" onSubmit={stockSearchHandler}>
                    <input type="text" className="form-input" placeholder="Search by Product Number" value={searchProductNumber} onChange={(e) => setSearchProductNumber(e.target.value)} />
                    <button className="search-btn" type="submit">Search</button>
                </form>
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>Product Number</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Category</th>
                            <th>Purchase Price</th>
                            <th>Selling Price</th>
                            <th>Supplier</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayStocks.map(stock => (
                            <tr key={stock.Product_Number}>
                                <td>{stock.Product_Number}</td>
                                <td>{stock.Product_Name}</td>
                                <td>{stock.Quantity}</td>
                                <td>{stock.Category}</td>
                                <td>{stock.PurchasePrice}</td>
                                <td>{stock.SellingPrice}</td>
                                <td>{stock.Supplier}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => showFormHandler(stock)}>Edit</button>
                                    <button className="delete-btn" onClick={stockDeleteHandler(stock.Product_Number)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockPage;



