// src/components/BarcodeSales.jsx
import React, { useState } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BarcodeScanner from "./BarcodeScanner"; // Barkod tarayıcı bileşenini içe aktarın
import axios from "axios";
import { FcOldTimeCamera } from "react-icons/fc";

function BarcodeSales() {
    const [showScanner, setShowScanner] = useState(false);
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [messageVisible, setMessageVisible] = useState(false);
    const navigate = useNavigate();

    // Barkod taramayı başlatan butonun işleyicisi
    const handleScanClick = () => {
        setShowScanner(true);
    };

    // Barkod tarandıktan sonra çağrılan fonksiyon
    const handleBarcodeDetected = async (barcode) => {
        setShowScanner(false);
        setScannedBarcode(barcode);
        try {
            const response = await axios.get(`http://localhost:3001/stock/${barcode}`);
            if (response.data.Quantity > 0) {
                setSelectedProduct(response.data);
                setQuantity(1); // Varsayılan miktar
                setMessage('');
                setMessageVisible(false);
            } else {
                setSelectedProduct(null);
                setMessage('Ürün stokta yok.');
                setMessageType('error');
                setMessageVisible(true);
            }
        } catch (error) {
            console.error("Ürün bulunamadı:", error);
            setSelectedProduct(null);
            setMessage("Ürün bulunamadı.");
            setMessageType("error");
            setMessageVisible(true);
        }
    };

    // Onayla butonuna basıldığında çalışacak fonksiyon
    const handleConfirm = async () => {
        if (selectedProduct && quantity > 0 && quantity <= selectedProduct.Quantity) {
            try {
                // Stok güncellemesi
                await axios.put(`http://localhost:3001/stock/quantity/${selectedProduct.Product_Number}`, {
                    Quantity: selectedProduct.Quantity - quantity
                });
    
                // Invoice sayfasına yönlendir
                const cart = [{
                    product: selectedProduct,
                    quantity,
                    totalPrice: selectedProduct.SellingPrice * quantity
                }];
    
                navigate('/invoice', { state: { cart } });
            } catch (error) {
                console.error("Ürün satışı sırasında hata oluştu:", error);
                setMessage("Ürün satılamadı.");
                setMessageType("error");
                setMessageVisible(true);
            }
        } else {
            setMessage("Belirtilen miktar stokta mevcut değil.");
            setMessageType("error");
            setMessageVisible(true);
        }
    };
    
    
    

    // Barkod tarayıcı modalını kapatmak için
    const handleCloseScanner = () => {
        setShowScanner(false);
    };

    return (
        <div className="barcode-sales-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Button variant="danger" onClick={handleScanClick}>
            <FcOldTimeCamera size={40} />
            </Button>

            {/* Barkod Tarayıcı Modal */}
            <Modal show={showScanner} onHide={handleCloseScanner} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Barcode Scanner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BarcodeScanner onScan={handleBarcodeDetected} onClose={handleCloseScanner} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseScanner}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Hata Mesajları */}
            {messageVisible && (
                <div className={`mb-4 p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} max-w-4xl mx-auto mt-4`}>
                    {message}
                </div>
            )}

            {/* Taranan Ürünü Gösteren Kart */}
            {selectedProduct && (
                <Card style={{ width: '18rem', margin: '20px auto' }}>
                    <Card.Body>
                        <Card.Title>{selectedProduct.Product_Name}</Card.Title>
                        <Card.Text>
                            <strong>Product Number:</strong> {selectedProduct.Product_Number} <br />
                            <strong>Quantity:</strong> {selectedProduct.Quantity} <br />
                            <strong>Category:</strong> {selectedProduct.Category} <br />
                            <strong>Selling Price:</strong> {selectedProduct.SellingPrice} TL <br />
                            <strong>Supplier:</strong> {selectedProduct.Supplier}
                        </Card.Text>
                        <Form.Group controlId="quantityInput">
                            <Form.Label>Miktar:</Form.Label>
                            <Form.Control 
                                type="number" 
                                min="1" 
                                max={selectedProduct.Quantity} 
                                value={quantity} 
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                            />
                        </Form.Group>
                        <Button variant="success" onClick={handleConfirm} className="mt-3">
                        Confirm and Add to Sale
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}

export default BarcodeSales;
