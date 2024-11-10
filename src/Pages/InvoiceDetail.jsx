

import React from 'react';

const InvoiceDetail = ({ invoice }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-black dark:text-black">Müşteri Bilgileri:</h2>
        <p className="text-gray-700 dark:text-black ">Adı: {invoice.customer.name}</p>
        <p className="text-gray-700 dark:text-black">Adres: {invoice.customer.address}</p>
        <p className="text-gray-700 dark:text-black">Telefon: {invoice.customer.phone}</p>
        <p className="text-gray-700 dark:text-black">Email: {invoice.customer.email}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-black dark:text-black ">Ürünler:</h2>
        {invoice.products.map((item, index) => {
          const price = parseFloat(item.price) || 0;
          const quantity = item.quantity || 0;
          const total = (price * quantity).toFixed(2);
          const currency = item.currency || '₺';

          return (
            <div key={index} className="flex mb-2 text-black dark:text-black">
              <div className="flex-1">{item.productName || 'Ürün adı mevcut değil'}</div>
              <div className="flex-1">{quantity}</div>
              <div className="flex-1">{item.price ? `${item.price} ${currency}` : 'Fiyat mevcut değil'}</div>
              <div className="flex-1">{item.price && quantity ? `${total} ${currency}` : 'Toplam mevcut değil'}</div>
            </div>
          );
        })}
      </div>

      <div className="text-right mt-8">
        <h3 className="text-lg font-semibold text-black dark:text-black">
          Toplam Tutar: {invoice.totalPrice} {invoice.currency || '₺'}
        </h3>
      </div>
    </div>
  );
};

export default InvoiceDetail;
