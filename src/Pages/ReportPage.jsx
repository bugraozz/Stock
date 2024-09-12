import React, { useState, useEffect } from 'react';
import InvoiceList from './InvoiceList'; // Doğru yolu kullan
import axios from 'axios';

const ReportPage = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:3001/invoices');
        console.log(response.data);
        setInvoices(response.data);
      } catch (error) {
        console.error('Faturalar yüklenirken hata oluştu:', error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      <InvoiceList invoices={invoices} />
    </div>
  );
};

export default ReportPage;
