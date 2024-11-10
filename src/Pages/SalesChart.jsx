


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as BarTooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const SalesChart = () => {
    const [currencyData, setCurrencyData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCurrencyData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/currency');
                console.log('Currency Data:', response.data);
                setCurrencyData(response.data);
            } catch (error) {
                console.error('Döviz verileri alınırken hata oluştu:', error);
            }
        };

        const fetchSalesData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/sales');
                console.log('Sales Data:', response.data);
                setSalesData(response.data);
            } catch (err) {
                console.error('Satış verileri alınırken hata oluştu:', err);
                setError(true);
            }
        };

        const fetchData = async () => {
            await fetchCurrencyData();
            await fetchSalesData();
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>An error occurred while retrieving data. Please try again later.</div>;
    }

    // Pie chart data format
    const pieData = currencyData.map(item => ({
        name: item.Currency,
        value: parseFloat(item.totalSales),
    }));

    // Bar chart data format
    const barData = salesData.map(item => ({
        productName: item.productName,
        quantitySold: item.quantity || 0,
    }));

    const COLORS = ['#ed7428', '#07870f', '#9e1122', '#92a30f'];

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-4xl font-semibold text-center mb-6">Sales Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">Currency Total Sales</h3>
                    <table className="w-full table table-zebra">
                        <thead>
                            <tr>
                                <th className="text-left-mt-4">Currency</th>
                                <th className="text-right-mt-4">Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currencyData.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4">{item.Currency}</td>
                                    <td className="text-right-mt-4">{item.totalSales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <PieChart width={400} height={300}>
                        <Pie
                            data={pieData}
                            cx={200}
                            cy={100}
                            labelLine={false}
                            label={entry => entry.name}
                            outerRadius={80}
                            fill="#ed7428"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                {/* Product Sales Chart Card */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">Product Sales Chart</h3>
                    {salesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}> 
          <BarChart
            data={salesData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="productName"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}   
              className="text-sm"
            />
             <YAxis domain={[0, 'dataMax + 10']} />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantitySold" fill={COLORS[0]} name="Quantity Sold" />
          </BarChart>
        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-600">No product sold data found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
