import { useState, useEffect } from 'react';
import { Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  created_at: string;
  payment_status: string;
  order_status: string;
  items: {
    product: {
      category: string;
    };
    quantity: number;
    price: number;
  }[];
}

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
}

interface ApiResponse {
  meta?: {
    total_revenue?: number;
  };
  orders?: Order[];
}

export default function SalesReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('week');
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'week'));
  const [toDate, setToDate] = useState(dayjs());

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${API_URL}/orders?period=${period}`;
      
      if (period === 'custom') {
        url += `&from=${fromDate.format('YYYY-MM-DD')}&to=${toDate.format('YYYY-MM-DD')}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      // Safely handle the response data
      const receivedOrders = data.orders || [];
      const receivedRevenue = data.meta?.total_revenue || 0;

      setOrders(receivedOrders);
      setTotalRevenue(receivedRevenue);

      // Calculate categories data
      const categoryMap = new Map<string, number>();
      receivedOrders.forEach((order) => {
        order.items.forEach(item => {
          const category = item.product?.category || 'Other';
          const amount = item.price * item.quantity;
          categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
        });
      });

      const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);
      const categoryData = Array.from(categoryMap.entries()).map(([name, amount]) => ({
        name,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0
      }));

      setCategories(categoryData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load sales data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, fromDate, toDate]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    switch (newPeriod) {
      case 'today':
        setFromDate(dayjs().startOf('day'));
        setToDate(dayjs());
        break;
      case 'yesterday':
        setFromDate(dayjs().subtract(1, 'day').startOf('day'));
        setToDate(dayjs().subtract(1, 'day').endOf('day'));
        break;
      case 'week':
        setFromDate(dayjs().subtract(1, 'week'));
        setToDate(dayjs());
        break;
      case 'month':
        setFromDate(dayjs().subtract(1, 'month'));
        setToDate(dayjs());
        break;
      default:
        break;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert severity="error" className="w-full max-w-md">
          {error}
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Sales Reports</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as string)}
            size="small"
            className="min-w-[150px]"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
          
          {period === 'custom' && (
            <div className="flex flex-col md:flex-row gap-4">
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue || dayjs())}
                slotProps={{ textField: { size: 'small' } }}
                maxDate={toDate}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => setToDate(newValue || dayjs())}
                slotProps={{ textField: { size: 'small' } }}
                minDate={fromDate}
              />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
            <div className="h-64 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">KSH{totalRevenue.toLocaleString()}</p>
              <p className="text-gray-500 mt-2">Total Revenue</p>
              <p className="text-gray-500 text-sm mt-4">
                {dayjs(fromDate).format('MMM D, YYYY')} - {dayjs(toDate).format('MMM D, YYYY')}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
            <div className="space-y-3">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between">
                      <h3 className="font-medium">{category.name}</h3>
                      <span>
                        ksh{category.amount.toLocaleString()} ({category.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No category data available</p>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ksh{order.total_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dayjs(order.created_at).format('MMM D, YYYY h:mm A')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.payment_status === 'pending'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.payment_status="completed"}
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.order_status === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.order_status === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.order_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No orders found for the selected period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}