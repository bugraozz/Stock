



import React, { useState, useMemo } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import InvoiceDetail from './InvoiceDetail'; // InvoiceDetail bileşenini ayrı dosyadan import ediyoruz

const InvoiceList = ({ invoices = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Seçilen faturayı tutmak için
  const [showDetail, setShowDetail] = useState(false); // Detay formunu açma kontrolü

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedInvoices = useMemo(() => {
    const filtered = invoices.filter((invoice) =>
      invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });
  }, [invoices, searchTerm, sortOrder]);

  const handleShowDetail = async (invoiceId) => {
    try {
      const response = await axios.get(`http://localhost:3001/invoices/${invoiceId}`);
      setSelectedInvoice(response.data); // Seçilen faturayı kaydediyoruz
      setShowDetail(true); // Formu açıyoruz
    } catch (error) {
      console.error('Fatura yüklenirken bir hata oluştu:', error);
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false); // Formu kapatıyoruz
    setSelectedInvoice(null); // Seçimi sıfırlıyoruz
  };

  return (
    <div className="max-h-screen  flex flex-col">
      <header className="bg-gradient-to-r text-black p-4 sticky top-0 z-10">
        <h1 className="text-4xl font-semibold text-center text-black ">Invoice List</h1>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <input
              type="text"
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <div className="flex items-center space-x-3">
              <select
                id="sortOrder"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {sortedInvoices.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">No invoices found.</p>
          ) : (
            <div className="overflow-x-auto max-h-[70vh] ">
              <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md text-sm">
                <thead className=" text-black">
                  <tr>
                    <th className="text-center py-2 px-3 uppercase font-semibold text-md text-black">Customer Name</th>
                    <th className="text-center py-2 px-3 uppercase font-semibold text-md text-black">Date</th>
                    <th className="text-center py-2 px-3 uppercase font-semibold text-md text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-100 transition duration-200">
                      <td className="py-2 px-3 border-b border-gray-300 text-black text-md">{invoice.customer_name || 'N/A'}</td>
                      <td className="py-2 px-3 border-b border-gray-300 text-black text-md">
                        {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-2 px-3 border-b border-gray-300 text-md">
                        <button
                          onClick={() => handleShowDetail(invoice.id)}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showDetail && selectedInvoice && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition duration-300 ease-in-out">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-semibold mb-4">Invoice #{selectedInvoice.id}</h2>
              <InvoiceDetail invoice={selectedInvoice} />
              <button
                onClick={handleCloseDetail}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-4 transition duration-200"
              >
                Close
              </button>

      

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InvoiceList;
