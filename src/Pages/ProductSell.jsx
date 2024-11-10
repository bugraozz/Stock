


import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ProductSell() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [messageVisible, setMessageVisible] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Yeni eklenen state
    const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: 1, TRY: 1 }); // TRY'yi sabit tutabiliriz

    const query = useQuery();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchExchangeRates(); // Döviz kurlarını çek
    }, []);

    // Döviz kurlarını çeken fonksiyon
    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TRY'); 
            setExchangeRates(response.data.rates);
        } catch (error) {
            console.error('Döviz kurları getirilemedi:', error);
            setMessage('Döviz kurları getirilemedi.');
            setMessageType('error');
            setMessageVisible(true);
        }
    };

    useEffect(() => {
        const barcodeParam = query.get('barcode');
        if (barcodeParam) {
            handleBarcodeChange({ target: { value: barcodeParam } });
        }
    }, [query]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/stock');
            setProducts(response.data);
        } catch (err) {
            console.error('Ürünler getirilemedi:', err);
            setMessage('Ürünler getirilemedi.');
            setMessageType('error');
            setMessageVisible(true);
        }
    };

    const addToCart = () => {
        if (selectedProduct && quantity > 0 && quantity <= selectedProduct.Quantity) {
            const existingProduct = cart.find(item => item.product.Product_Number === selectedProduct.Product_Number);
            if (existingProduct) {
                existingProduct.quantity += quantity;
                existingProduct.totalPrice += selectedProduct.SellingPrice * quantity;
                setCart([...cart]); // Trigger re-render
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

    const getTotalCartPriceByCurrency = () => {
        return cart.reduce((totals, item) => {
            const currency = item.product.Currency || '₺'; // Varsayılan olarak TL al
            if (!totals[currency]) {
                totals[currency] = 0;
            }
            totals[currency] += item.totalPrice;
            return totals;
        }, {});
    };

    // Sepet toplamını TL cinsine çeviren fonksiyon
    const getTotalCartPriceInTRY = () => {
        return cart.reduce((totalTRY, item) => {
            const currency = item.product.Currency || 'TRY';
            const exchangeRate = exchangeRates[currency] || 1; // Döviz kuru varsa kullan, yoksa 1
            return totalTRY + (item.totalPrice / exchangeRate); // TL cinsinden fiyat
        }, 0);
    };

    return (
        <div className="min-h-screen bg-white-100 ">
            {/* Header */}
            <header className="w-full bg-white-600  py-4 ">
                <h1 className="text-4xl font-semibold text-center text-black ">PRODUCT SELL</h1>
            </header>

            {/* Main Content */}
            <main className="w-full p-4">
                {/* Messages */}
                {messageVisible && (
                    <div className={`mb-4 p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} max-w-4xl mx-auto`}>
                        {message}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 ">
                    {/* Products Table */}
                    <div className="flex-1 ">
                        <div className="overflow-x-auto rounded-xl ">
                            <table className="min-w-full bg-white border border-black-200 rounded-lg shadow-md ">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2  text-center text-black">#</th>
                                        <th className="px-4 py-2 text-center text-black">Product</th>
                                        <th className="px-4 py-2 text-center text-black">Selling Price</th>
                                        <th className="px-4 py-2  text-center text-black">Quantity</th>
                                        <th className="px-4 py-2  text-center text-black">Category</th>
                                        <th className="px-4 py-2  text-center text-black">Supplier</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr
                                            key={product.id}
                                            onClick={() => handleRowClick(product)}
                                            className={`cursor-pointer hover:bg-gray-100 ${selectedProduct?.id === product.id ? 'bg-blue-300' : ''}`}
                                        >
                                            <td className="px-4 py-2 border-b text-center text-black">{index + 1}</td>
                                            <td className="px-4 py-2 border-b text-center text-black">{product.Product_Name}</td>
                                            <td className="px-4 py-2 border-b text-center text-black">{product.SellingPrice} {product.Currency || '₺'}</td>
                                            <td className="px-4 py-2 border-b text-center text-black">{product.Quantity}</td>
                                            <td className="px-4 py-2 border-b text-center text-black">{product.Category}</td>
                                            <td className="px-4 py-2 border-b text-center text-black">{product.Supplier}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Selected Product Details */}
                        {selectedProduct && (
                            <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50 max-w-4xl mx-auto">
                                <h4 className="text-lg font-medium mb-2 text-black">Selected Product: {selectedProduct.Product_Name}</h4>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <label className="block text-sm font-medium text-black">Quantity</label>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            min={1}
                                            max={selectedProduct.Quantity}
                                            className="mt-1 block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                        />
                                    </div>
                                    <button
                                        onClick={addToCart}
                                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body  ">
                            <h4 className="card-title text-black">Cart Summary</h4>
                            {cart.length > 0 ? (
                                <>
                                    <ul className="mb-4 space-y-2">
                                        {cart.map((item, index) => (
                                            <li key={index} className="flex justify-between items-center">
                                                <span>{item.product.Product_Name}</span>
                                                <span>{item.quantity} x {item.product.SellingPrice} {item.product.Currency || '₺'} = {item.totalPrice} {item.product.Currency || '₺'}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {Object.entries(getTotalCartPriceByCurrency()).map(([currency, total]) => (
                                        <div key={currency} className="flex justify-between font-semibold mb-4 text-black">
                                            <span>Toplam ({currency}):</span>
                                            <span>{total.toFixed(2)} {currency}</span>
                                        </div>
                                    ))}

                                    {/* TL cinsinden toplam */}
                                    <div className="flex justify-between font-semibold mb-4">
                                        <span>Toplam (₺):</span>
                                        <span>{getTotalCartPriceInTRY().toFixed(2)} ₺</span>
                                    </div>

                                    <button
                                        onClick={handleSell}
                                        className="btn btn-primary"
                                    >
                                        Sell ​​All
                                    </button>
                                </>
                            ) : (
                                <p className="text-gray-600">Your cart is empty.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirm Sell Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center text-black">
                    <div className="bg-white p-8 rounded-md shadow-md max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Confirm Sell</h3>
                        <p className="mb-4">Are you sure you want to sell all items?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSell}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductSell;
