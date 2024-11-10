


import axios from 'axios';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Barcode from './Barcode';
import BarcodeScanner from './BarcodeScanner';


const StockPage = () => {
    const [stocks, setStocks] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [formData, setFormData] = useState({
        Product_Number: '',
        Product_Name: '',
        Quantity: '',
        Category: '',
        PurchasePrice: '',
        SellingPrice: '',
        Supplier: '',
        Currency: 'TRY',
    });
    const [searchProductNumber, setSearchProductNumber] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showBarcode, setShowBarcode] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [displayStocks, setDisplayStocks] = useState(stocks);

    useEffect(() => {
        StockList();
        if (searchProductNumber.trim() === "") {
            setDisplayStocks(stocks); // Arama alanı boşsa tüm stokları göster
        } else {
            const filteredStocks = stocks.filter(stock =>
                stock.Product_Number.includes(searchProductNumber)
            );
            setDisplayStocks(filteredStocks); // Arama sonuçlarını güncelle
        }
    }, [searchProductNumber, stocks]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const showFormHandler = (stock = {}) => {
        setShowForm(true);
        const editMode = !!stock.Product_Number && stocks.some(s => s.Product_Number === stock.Product_Number);
        setIsEditMode(editMode);
        if (editMode) {
            const existingStock = stocks.find(s => s.Product_Number === stock.Product_Number);
            setFormData({
                Product_Number: existingStock.Product_Number || '',
                Product_Name: existingStock.Product_Name || '',
                Quantity: existingStock.Quantity || '',
                Category: existingStock.Category || '',
                PurchasePrice: existingStock.PurchasePrice || '',
                SellingPrice: existingStock.SellingPrice || '',
                Supplier: existingStock.Supplier || '',
                Currency: existingStock.Currency || 'TRY',
            });
        } else {
            setFormData({
                Product_Number: stock.Product_Number || '',
                Product_Name: '',
                Quantity: '',
                Category: '',
                PurchasePrice: '',
                SellingPrice: '',
                Supplier: '',
                Currency: 'TRY',
            });
        }
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
                StockList();
                setFormData({
                    Product_Number: '',
                    Product_Name: '',
                    Quantity: '',
                    Category: '',
                    PurchasePrice: '',
                    SellingPrice: '',
                    Supplier: '',
                    Currency: 'TRY',
                });
                handleClose();
            })
            .catch(error => {
                console.error('Bir hata oluştu!', error);
            });
    };

    const stockUpdateHandler = (event) => {
        event.preventDefault();
        const updatedStock = { ...formData };

        axios.put(`http://localhost:3001/stock/${formData.Product_Number}`, updatedStock)
            .then(response => {
                StockList();
                setFormData({
                    Product_Number: '',
                    Product_Name: '',
                    Quantity: '',
                    Category: '',
                    PurchasePrice: '',
                    SellingPrice: '',
                    Supplier: '',
                    Currency: 'TRY',
                });
                handleClose();
            })
            .catch(error => {
                console.error('Bir hata oluştu!', error);
            });
    };

    const stockDeleteHandler = (Product_Number) => {
        return (event) => {
            event.preventDefault();

            axios.delete(`http://localhost:3001/stock/${Product_Number}`)
                .then(response => {
                    StockList();
                })
                .catch(error => {
                    console.error('Bir hata oluştu!', error);
                });
        };
    };

    const stockSearchHandler = (event) => {
        event.preventDefault();

        axios.get(`http://localhost:3001/stock/${searchProductNumber}`)
            .then(response => {
                setSearchResults([response.data]);
            })
            .catch(error => {
                console.error('Bir hata oluştu!', error);
            });
    };

    const StockList = () => {
        axios.get('http://localhost:3001/stock')
            .then(response => {
                setStocks(response.data);
                setSearchResults([]);
            })
            .catch(error => {
                console.error('Bir hata oluştu!', error);
            });
    };

    const handleBarcodeClick = (stock) => {
        setSelectedStock(stock);
        setShowBarcode(true);
    };

    // const displayStocks = searchResults.length > 0 ? searchResults : stocks;

    const handleBarcodeDetected = (code) => {
        setShowScanner(false);
        const existingStock = stocks.find(stock => stock.Product_Number === code);
        if (existingStock) {
            showFormHandler(existingStock);
        } else {
            showFormHandler({ Product_Number: code });
        }
    };

    const exportToExcel = () => {
        
        const worksheet = XLSX.utils.json_to_sheet(displayStocks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Stocks');
        XLSX.writeFile(workbook, 'stocks.xlsx');
        
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        

        reader.onload = (e) => {
            
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            
            setFileData(jsonData);
            
        };
       
        reader.readAsArrayBuffer(file);
        StockList();
       
    };

    
    const handleProcessData = () => {
        if (fileData) {
           
            axios.get('http://localhost:3001/stock')
                .then(response => {
                    const existingStocks = response.data;
    
                    
                    fileData.forEach((item) => {
                        const existingStock = existingStocks.find(stock => stock.Product_Number === item.Product_Number);
                        
                        if (!existingStock) {
                            // Ürün mevcut değilse veritabanına POST isteği gönder
                            axios.post('http://localhost:3001/stock', item)
                                .then(response => {
                                    console.log('Ürün eklendi:', response.data);
                                })
                                .catch(error => {
                                    console.error('Bir hata oluştu:', error);
                                });
                        } else {
                            alert(`Ürün zaten mevcut: ${item.Product_Number}`);
                            StockList();

                        }
                    });
    
                    
                    const newStocks = fileData.filter(item => !existingStocks.some(stock => stock.Product_Number === item.Product_Number));
                    setStocks(newStocks);
    
                })
                .catch(error => {
                    console.error('Bir hata oluştu!', error);
                });
        } else {
            alert("Lütfen önce bir dosya yükleyin!");
        }
    };
    const fileInputRef = React.useRef(null);

return (
    <div className="overflow-x-auto min-h-screen  p-10">
        {/* Başlık ve Eylem Butonları */}
        <div className="flex justify-start mb-4 space-x-4">
            <button className="btn btn-primary btn-sm" onClick={() => showFormHandler()}>Stock Add</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowScanner(true)}>Add with Barcode</button>
        </div>

        {/* Barkod Tarayıcı Popup */}
        {showScanner && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="card w-3/4 bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <h2 className="card-title">Barcode Scanner</h2>
                            <button onClick={() => { setShowScanner(false); handleClose(); }} className="btn btn-error btn-sm">X</button>
                        </div>
                        <div className="mt-4">
                            <BarcodeScanner onScan={handleBarcodeDetected} onClose={() => setShowScanner(false)} />
                        </div>
                        <div className="card-actions justify-end mt-4">
                            <button className="btn btn-secondary" onClick={() => { setShowScanner(false); handleClose(); }}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Stok Ekleme veya Güncelleme Formu */}
        {showForm && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="card w-3/4 max-w-lg bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">{isEditMode ? 'Stock Edit' : 'Stock Add'}</h2>
                        <form onSubmit={isEditMode ? stockUpdateHandler : stockAddHandler} className="space-y-4">
                            <input type="text" name="Product_Number" value={formData.Product_Number} placeholder="Product Number" onChange={handleChange} readOnly={isEditMode} className="input input-bordered w-full" required />
                            <input type="text" name="Product_Name" value={formData.Product_Name} placeholder="Product Name" onChange={handleChange} className="input input-bordered w-full" required />
                            <input type="number" name="Quantity" value={formData.Quantity} placeholder="Quantity" onChange={handleChange} className="input input-bordered w-full" required />
                            <input type="text" name="Category" value={formData.Category} placeholder="Category" onChange={handleChange} className="input input-bordered w-full" required />
                            <input type="number" name="PurchasePrice" value={formData.PurchasePrice} placeholder="Purchase Price" onChange={handleChange} className="input input-bordered w-full" required />
                            <input type="number" name="SellingPrice" value={formData.SellingPrice} placeholder="Selling Price" onChange={handleChange} className="input input-bordered w-full" required />
                            <input type="text" name="Supplier" value={formData.Supplier} placeholder="Supplier" onChange={handleChange} className="input input-bordered w-full" required />
                            <select name="Currency" value={formData.Currency} onChange={handleChange} className="select select-bordered w-full">
                                <option value="TRY">TRY</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                            <div className="card-actions justify-end mt-4 space-x-2">
                                <button type="submit" className="btn btn-primary">{isEditMode ? 'Update' : 'Add'}</button>
                                <button type="button" onClick={handleClose} className="btn btn-secondary">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}

<form className="mt-4">
                <div className="flex items-center space-x-9">
                    <input
                        type="text"
                        value={searchProductNumber}
                        onChange={(e) => setSearchProductNumber(e.target.value)}
                        placeholder="Search by Product Number"
                        className="input input-bordered w-60 h-8    "
                    />
                    <div className="ml-auto space-x-2 flex items-center">
                        <button className="btn btn-primary btn-sm" onClick={handleProcessData}>Import</button>
                        <button className="btn btn-primary btn-sm" onClick={exportToExcel}>Export</button>
                    </div>
                </div>
                <div className="flex justify-end mt-2">
                    <input type="file" className="file-input file-input-bordered file-input-xs w-full max-w-sm" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
            </form>

        {/* Stok Tablosu */}
        <div className="overflow-x-auto mt-4">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>Product Number</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Purchase Price</th>
                        <th>Selling Price</th>
                        <th>Supplier</th>
                        <th>Currency</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayStocks.map((stock) => (
                        <tr key={stock.Product_Number}>
                            <td>{stock.Product_Number}</td>
                            <td>{stock.Product_Name}</td>
                            <td>{stock.Quantity}</td>
                            <td>{stock.Category}</td>
                            <td>{stock.PurchasePrice}</td>
                            <td>{stock.SellingPrice}</td>
                            <td>{stock.Supplier}</td>
                            <td>{stock.Currency}</td>
                            <td className="space-x-2">
                                <button className="btn btn-success btn-sm" onClick={() => showFormHandler(stock)}>Edit</button>
                                <button  className="btn  btn-info btn-sm" onClick={stockDeleteHandler(stock.Product_Number)}>Delete</button>
                                <button className="btn btn-warning btn-sm" onClick={() => handleBarcodeClick(stock)}>Barcode</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {showBarcode && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <h2 className="card-title">Barcode</h2>
                            <button onClick={() => setShowBarcode(false)} className="btn btn-error btn-sm">X</button>
                        </div>
                        <div className="mt-4">
                            <Barcode value={selectedStock.Product_Number} />
                        </div>
                        <div className="card-actions justify-end mt-4">
                            <button className="btn btn-secondary" onClick={() => setShowBarcode(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default StockPage;



