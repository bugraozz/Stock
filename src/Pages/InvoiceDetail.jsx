import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/InvoiceDetail.css'; // Stil dosyasını eklemeyi unutma

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/invoices/${id}`);
        console.log(response.data);
        setInvoice(response.data);
      } catch (error) {
        console.error('Fatura yüklenirken bir hata oluştu:', error);
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) return <p>Yükleniyor...</p>;

  return (
    <div className="invoice-detail">
      <h1>Fatura Detayı</h1>
      <div className="invoice-header">
        <h2>Fatura ID: {invoice.id}</h2>
        <p>Tarih: {new Date(invoice.date).toLocaleDateString()}</p>
      </div>
      <div className="invoice-customer">
        <h3>Müşteri Bilgileri</h3>
        <p>Adı: {invoice.customer.name}</p>
        <p>Adres: {invoice.customer.address}</p>
        <p>Email: {invoice.customer.email}</p>
        <p>Telefon: {invoice.customer.phone}</p>
      </div>
      <div className="invoice-products">
        <h3>Ürünler</h3>
        <table className="products-table">
          <thead>
            <tr>
              <th>Ürün Adı</th>
              <th>Miktar</th>
              <th>Fiyat</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((item, index) => (
              <tr key={index}>
                <td>{item.product.Product_Name}</td>
                <td>{item.quantity}</td>
                <td>{item.product.SellingPrice}₺</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="invoice-total">
        <h3>Toplam Tutar: {invoice.total}₺</h3>
      </div>
    </div>
  );
};

export default InvoiceDetail;

