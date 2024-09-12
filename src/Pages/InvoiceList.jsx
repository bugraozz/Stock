import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/InvoiceList.css'; // Stil dosyasını eklemeyi unutma

const InvoiceList = ({ invoices = [] }) => {
return (
    <div className="invoice-list">
        <h1>Invoice List</h1>
        {invoices.length === 0 ? (
            <p>Fatura bulunamadı.</p>
        ) : (
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Invoice ID</th>
                        <th>Customer Name</th>
                        
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>{invoice.customer_name || 'Bilgi Yok'}</td> 
                           
                            <td>{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'Bilgi Yok'}</td>
                            <td>
                                <Link to={`/pdf/${invoice.id}`} className="view-button">
                                    Show
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);
};

export default InvoiceList;

