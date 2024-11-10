



import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useLocation, useNavigate } from 'react-router-dom';
import InvoicePDF from './InvoicePDF'; // PDF için bileşen
import axios from 'axios';
import '../Styles/Invoice.css';

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || { cart: [] };
  
  const [customer_name, setCustomerName] = useState('');
  const [customer_address, setCustomerAddress] = useState('');
  const [customer_email, setCustomerEmail] = useState('');
  const [customer_phone, setCustomerPhone] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: 1, TRY: 1 });



  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Müşteri verileri yüklenirken hata oluştu:', error);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TRY');
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error('Döviz kurları getirilemedi:', error);
      }
    };

    fetchCustomers();
    fetchExchangeRates();
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

  // Para birimine göre toplam hesaplama
  const getTotalCartPriceByCurrency = () => {
    return cart.reduce((totals, item) => {
      const currency = item.product.Currency || '₺'; // Varsayılan olarak TL al
      if (!totals[currency]) {
        totals[currency] = 0;
      }
      totals[currency] += item.product.SellingPrice * item.quantity; // Güncellenmiş toplam hesaplama
      return totals;
    }, {});
  };

  // Toplam fiyatı döviz kuru ile hesaplama
  const getTotalPriceInTRY = () => {
    return cart.reduce((total, item) => {
      const priceInCurrency = item.product.SellingPrice || 0;
      const currency = item.product.Currency || '₺';
      const exchangeRate = exchangeRates[currency] || 1; // Eğer döviz kuru yoksa 1 (TL) kullan
      return total + (priceInCurrency * item.quantity) / exchangeRate; // TL cinsinden toplam hesapla
    }, 0);
  };

  const total_price = getTotalPriceInTRY(); // TL cinsinden toplam hesaplama



  const handleSaveInvoice = async () => {
    setSaving(true);
    const total = total_price; // Normal toplamı kullan
  
    try {
      await axios.post('http://localhost:3001/invoices', {
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
  
      // 3 saniye bekleyip ana sayfaya yönlendir
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      setSaveMessage('Fatura kaydedilirken bir hata oluştu.');
      console.error('Fatura kaydedilirken hata:', error);
    } finally {
      setSaving(false);
    }
  };
  



  
  // Toplam fiyat hesaplama fonksiyonu
  const calculateTotalPrice = () => {
    return products.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0).toFixed(2); // Toplamı iki ondalık basamakla döndür
  };
  
  
  
  

  const currencyTotals = getTotalCartPriceByCurrency(); // Para birimlerine göre toplamları al

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Fatura Oluştur</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Müşteri Bilgileri</h2>
        <input
          type="text"
          placeholder="Müşteri Adı"
          value={customer_name}
          onChange={handleCustomerSearch}
          className="border p-2 w-full rounded mb-2"
        />
        {filteredCustomers.length > 0 && (
          <ul className="border border-gray-300 rounded max-h-40 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <li
                key={customer.id}
                onClick={() => handleCustomerSelect(customer)}
                className="cursor-pointer p-2 hover:bg-gray-200"
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
          className="border p-2 w-full rounded mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={customer_email}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="border p-2 w-full rounded mb-2"
        />
        <input
          type="tel"
          placeholder="Telefon"
          value={customer_phone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="border p-2 w-full rounded mb-2"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ürünler</h2>
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <p>
              {item.product.Product_Name} - {item.quantity} x {item.product.SellingPrice} {item.product.Currency || '₺'}
            </p>
          </div>
        ))}
        <h3 className="text-lg font-semibold">Toplam (TL): {total_price.toFixed(2)} ₺</h3>
        
        
        <h3 className="text-lg font-semibold mt-4">Para Birimine Göre Toplamlar:</h3>
        {Object.entries(currencyTotals).map(([currency, total]) => (
          <p key={currency}>{currency}: {total.toFixed(2)} {currency}</p> 
        ))}
      </div>

     

      <button
        onClick={handleSaveInvoice}
        disabled={saving}
        className={`mt-4 bg-green-500 text-white px-4 py-2 rounded ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
      >
        {saving ? 'Kaydediliyor...' : 'Satışı Tamamla'}
       
      </button>
      {saveMessage && <p className="mt-2 text-red-500">{saveMessage}</p>}

          

    </div>
  );  
};

export default Invoice;
