



import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../Styles/ProductSell.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ProductSell() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [messageVisible, setMessageVisible] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [showModal, setShowModal] = useState(false);
    
    const query = useQuery();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const barcode = query.get('barcode');
        if (barcode) {
            handleBarcodeChange({ target: { value: barcode } });
        }
    }, [query]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/stock');
            setProducts(response.data);
        } catch (err) {
            console.error('Ürünler getirilemedi:', err);
        }
    };

    const addToCart = () => {
        if (selectedProduct && quantity > 0 && quantity <= selectedProduct.Quantity) {
            const existingProduct = cart.find(item => item.product.Product_Number === selectedProduct.Product_Number);
            if (existingProduct) {
                existingProduct.quantity += quantity;
                existingProduct.totalPrice += selectedProduct.SellingPrice * quantity;
            } else {
                setCart([...cart, {
                    product: selectedProduct,
                    quantity,
                    totalPrice: selectedProduct.SellingPrice * quantity
                }]);
            }
            setSelectedProduct(null);
            setQuantity(1);
            setMessage('');
            setMessageVisible(false);
        } else {
            setMessage('Ürün sepete eklenemedi.');
            setMessageType('error');
            setMessageVisible(true);
        }
    };

    const handleSell = async () => {
        if (cart.length > 0) {
            setShowModal(true);
        } else {
            setMessage('Sepet boş.');
            setMessageType('error');
            setMessageVisible(true);
        }
    };

    const confirmSell = async () => {
        try {
            for (const item of cart) {
                await axios.put(`http://localhost:3001/stock/quantity/${item.product.Product_Number}`, {
                    Quantity: item.product.Quantity - item.quantity
                });
            }
            navigate('/invoice', { state: { cart } });
        } catch (err) {
            console.error('Ürün satışı sırasında hata oluştu:', err);
            setMessage('Ürün satılamadı.');
            setMessageType('error');
            setMessageVisible(true);
        }
        setShowModal(false);
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setMessage('');
        setMessageVisible(false);
    };

    const handleBarcodeChange = (e) => {
        setBarcode(e.target.value);
        if (e.target.value.length >= 6) {
            const product = products.find(p => p.Barcode === e.target.value);
            if (product) {
                setSelectedProduct(product);
                setQuantity(1);
                setMessage('');
                setMessageVisible(false);
            } else {
                setSelectedProduct(null);
                setMessage('Barkod bulunamadı.');
                setMessageType('error');
                setMessageVisible(true);
            }
        }
    };

    const getTotalCartPrice = () => {
        return cart.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    return (
        <div className="product-sell-container">
            <h3>Product Sales</h3>
            <input
                type="text"
                value={barcode}
                onChange={handleBarcodeChange}
                placeholder="Barkod girin"
                className="barcode-input"
            />
            <div className="product-sell-form">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Selling Price</th>
                            <th>Quantity</th>
                            <th>Category</th>
                            <th>Supplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr
                                key={product.id}
                                onClick={() => handleRowClick(product)}
                                className={selectedProduct?.id === product.id ? 'selected' : ''}
                            >
                                <td>{index + 1}</td>
                                <td>{product.Product_Name}</td>
                                <td>{product.SellingPrice} TL</td>
                                <td>{product.Quantity}</td>
                                <td>{product.Category}</td>
                                <td>{product.Supplier}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedProduct && (
                    <div className="product-details">
                        <h4>Selected product: {selectedProduct.Product_Name}</h4>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            min={1}
                            max={selectedProduct.Quantity}
                        />
                        <button onClick={addToCart}>Add to Cart</button>
                    </div>
                )}
                {cart.length > 0 && (
                    <div className="cart-summary">
                        <h4>Cart Summary</h4>
                        <ul>
                            {cart.map((item, index) => (
                                <li key={index}>
                                    {item.product.Product_Name} - {item.quantity} x {item.product.SellingPrice} TL = {item.totalPrice} TL
                                </li>
                            ))}
                        </ul>
                        <p>Total Cart Price: {getTotalCartPrice()} TL</p>
                        <button onClick={handleSell}>Sell All</button>
                    </div>
                )}
            </div>
            {messageVisible && (
                <p className={`message ${messageType}`}>{message}</p>
            )}
            <Link to="/home">Home</Link>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content modal-centered">
                        <h4>Are you sure you want to confirm the sale?</h4>
                        <button onClick={confirmSell} className="btn btn-primary">Confirm</button>
                        <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductSell;
