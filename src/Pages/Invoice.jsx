import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF'; // PDF için bileşen
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Invoice.css';

const Invoice = () => {
  const location = useLocation();
  const { cart } = location.state || { cart: [] };

  const [customer_name, setCustomerName] = useState('');
  const [customer_address, setCustomerAddress] = useState('');
  const [customer_email, setCustomerEmail] = useState('');
  const [customer_phone, setCustomerPhone] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Müşteri verilerini yüklemek için API çağrısı
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Müşteri verileri yüklenirken hata oluştu:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerSearch = (e) => {
    const value = e.target.value;
    setCustomerName(value);

    if (value) {
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  };

  const handleCustomerSelect = (customer) => {
    setCustomerName(customer.name);
    setCustomerAddress(customer.address);
    setCustomerEmail(customer.email);
    setCustomerPhone(customer.phone);
    setFilteredCustomers([]); // Seçim yapıldığında öneri listesini temizle
  };

  const total_price = cart.reduce((sum, item) => sum + item.product.SellingPrice * item.quantity, 0);

  const handleSaveInvoice = async () => {
    setSaving(true);
    const total = total_price;
  
    try {
      const response = await axios.post('http://localhost:3001/invoices', {
        customer: {
          name: customer_name,
          address: customer_address,
          email: customer_email,
          phone: customer_phone
        },
        products: cart,
        total: total
      });
      setSaveMessage('Fatura başarıyla kaydedildi.');
    } catch (error) {
      setSaveMessage('Fatura kaydedilirken bir hata oluştu.');
      console.error('Fatura kaydedilirken hata:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Fatura Oluştur</h1>
      <div>
        <h2>Müşteri Bilgileri</h2>
        <input
          type="text"
          placeholder="Müşteri Adı"
          value={customer_name}
          onChange={handleCustomerSearch}
        />
        {filteredCustomers.length > 0 && (
          <ul style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto' }}>
            {filteredCustomers.map((customer) => (
              <li
                key={customer.id}
                onClick={() => handleCustomerSelect(customer)}
                style={{ cursor: 'pointer', padding: '5px' }}
              >
                {customer.name}
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          placeholder="Adres"
          value={customer_address}
          onChange={(e) => setCustomerAddress(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={customer_email}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Telefon"
          value={customer_phone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </div>

      <div>
        <h2>Ürünler</h2>
        {cart.map((item, index) => (
          <div key={index}>
            <p>{item.product.Product_Name} - {item.quantity} x {item.product.SellingPrice}₺</p>
          </div>
        ))}
        <h3>Toplam: {total_price}₺</h3>
      </div>

      {/* PDF indirme bağlantısı */}
      <PDFDownloadLink
        document={<InvoicePDF customer={{ name: customer_name, address: customer_address, email: customer_email, phone: customer_phone }} products={cart} totalPrice={total_price} id="12345" />} // Fatura ID'sini uygun şekilde ayarla
        fileName={`invoice-${new Date().toISOString()}.pdf`}
      >
        {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
      </PDFDownloadLink>

      {/* Faturayı kaydet butonu */}
      <button onClick={handleSaveInvoice} disabled={saving}>
        {saving ? 'Kaydediliyor...' : 'Faturayı Kaydet'}
      </button>

      {saveMessage && <p>{saveMessage}</p>}
    </div>
  );
};

export default Invoice;


