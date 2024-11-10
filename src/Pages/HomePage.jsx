


import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineUser, AiOutlineStock, AiOutlineShopping, AiOutlineTeam, AiOutlineFileText, AiOutlineAreaChart, AiOutlineBarcode } from 'react-icons/ai';
import Clock from './Clock';


const HomePage = () => {


  return (
    <div className="p-1 text-center relative "> 
      <div className="mb-20"> 
        <Clock />
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-20"> {/* mb-20 ile alt boşluk bırakıldı */}
        <Link to="/admin" className="bg-white border border-gray-300 rounded-lg p-5 w-48 shadow-md hover:-translate-y-1 transform transition">
          <AiOutlineUser size={100} className="mx-auto" style={{ color: '#4CAF50' }} />
          <h2 className="mt-4 text-xl font-semibold">User</h2>
        </Link>

        <Link to="/stock" className="bg-white border border-gray-300 rounded-lg p-5 w-48 shadow-md hover:-translate-y-1 transform transition">
          <AiOutlineStock size={100} className="mx-auto" style={{ color: '#CF9800' }} />
          <h2 className="mt-4 text-xl font-semibold">Stock</h2>
        </Link>

        <Link to="/sell" className="bg-white border border-gray-300 rounded-lg p-5 w-48 shadow-md hover:-translate-y-1 transform transition">
          <AiOutlineShopping size={100} className="mx-auto" style={{ color: '#9116F3' }} />
          <h2 className="mt-4 text-xl font-semibold">Sales</h2>
        </Link>

        <Link to="/customer" className="bg-white border border-gray-300 rounded-lg p-5 w-48 shadow-md hover:-translate-y-1 transform transition">
          <AiOutlineTeam size={100} className="mx-auto" style={{ color: '#1324B6' }} />
          <h2 className="mt-4 text-xl font-semibold">Customers</h2>
        </Link>

        <Link to="/report" className="bg-white border border-gray-300 rounded-lg p-5 w-48 shadow-md hover:-translate-y-1 transform transition">
          <AiOutlineFileText size={100} className="mx-auto" style={{ color: '#114906' }} />
          <h2 className="mt-4 text-xl font-semibold">Invoice</h2>
        </Link>

        <Link to="/chart" className="bg-white border border-gray-300 rounded-lg p-5 w-48 shadow-md hover:-translate-y-1 transform transition">
          <AiOutlineAreaChart size={100} className="mx-auto" style={{ color: '#FF5722' }} />
          <h2 className="mt-4 text-xl font-semibold">Chart</h2>
        </Link>

        <Link to="/barcodesales" className="bg-white border border-gray-300 rounded-lg p-5 w-48 shadow-md hover:-translate-y-1 transform transition">
          <AiOutlineBarcode size={100} className="mx-auto" style={{ color: '#5F1459' }} />
          <h2 className="mt-4 text-xl font-semibold">Barcode Sales</h2>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
