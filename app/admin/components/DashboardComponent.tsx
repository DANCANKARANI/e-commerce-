"use client";

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  role?: 'customer' | 'seller' | 'admin';
  status?: 'active' | 'inactive';
}

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  stock?: number;
  createdAt?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  category?: string;
  createdAt?: string;
}

interface Order {
  id: string;
  userId: string;
  userName?: string;
  items?: Array<{
    productId?: string;
    serviceId?: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DashboardComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersRes, productsRes, servicesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/user/all`),
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/orders`)
      ]);

      // Check individual responses
      if (!usersRes.ok) throw new Error(`Users API failed with status ${usersRes.status}`);
      if (!productsRes.ok) throw new Error(`Products API failed with status ${productsRes.status}`);
      if (!servicesRes.ok) throw new Error(`Services API failed with status ${servicesRes.status}`);
      if (!ordersRes.ok) throw new Error(`Orders API failed with status ${ordersRes.status}`);

      // Parse responses with error handling
      const parseResponse = async (response: Response) => {
        try {
          const data = await response.json();
          return data;
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          throw new Error('Invalid response format from server');
        }
      };

      const [usersData, productsData, servicesData, ordersData] = await Promise.all([
        parseResponse(usersRes),
        parseResponse(productsRes),
        parseResponse(servicesRes),
        parseResponse(ordersRes)
      ]);

      // Extract data from potential wrapper objects
      const extractArray = (data: unknown, potentialKeys: string[]): unknown[] => {
        if (Array.isArray(data)) return data;
        for (const key of potentialKeys) {
          if (typeof data === 'object' && data !== null && key in data) {
            const value = (data as Record<string, unknown>)[key];
            if (Array.isArray(value)) {
              return value;
            }
          }
        }
        return [];
      };
      

    setUsers(extractArray(usersData, ['data', 'users']) as User[]);
    setProducts(extractArray(productsData, ['data', 'products']) as Product[]);
    setServices(extractArray(servicesData, ['data', 'services']) as Service[]);
    setOrders(extractArray(ordersData, ['data', 'orders']) as Order[]);


    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const safeDateParse = (dateString: string | undefined): Date => {
    if (!dateString) return new Date(0);
    try {
      return new Date(dateString);
    } catch {
      return new Date(0);
    }
  };

  const calculateMetrics = () => {
    // Create safe copies of the data
    const safeUsers = [...users];
    const safeProducts = [...products];
    const safeServices = [...services];
    const safeOrders = [...orders];

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // User metrics with safe property access
    const totalUsers = safeUsers.length;
    const activeUsers = safeUsers.filter(u => u?.status === 'active').length;
    const sellers = safeUsers.filter(u => u?.role === 'seller').length;
    const newUsersThisMonth = safeUsers.filter(u => 
      safeDateParse(u?.createdAt) > oneMonthAgo
    ).length;

    // Product metrics
    const totalProducts = safeProducts.length;
    const outOfStockProducts = safeProducts.filter(p => (p?.stock ?? 0) <= 0).length;

    // Service metrics
    const totalServices = safeServices.length;

    // Order metrics
    const totalOrders = safeOrders.length;
    const pendingOrders = safeOrders.filter(o => o?.status === 'pending').length;
    const completedOrders = safeOrders.filter(o => o?.status === 'completed').length;
    const monthlyRevenue = safeOrders
      .filter(o => o?.status === 'completed' && safeDateParse(o?.createdAt) > oneMonthAgo)
      .reduce((sum, order) => sum + (order?.totalAmount ?? 0), 0);

    // Recent data for tables with fallback values
    const recentUsers = [...safeUsers]
      .sort((a, b) => {
        const dateA = safeDateParse(a?.createdAt);
        const dateB = safeDateParse(b?.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map(user => ({
        id: user?.id ?? 'unknown',
        name: user?.name ?? 'Unknown',
        email: user?.email ?? 'unknown@example.com',
        role: user?.role ?? 'customer',
        status: user?.status ?? 'inactive',
        createdAt: user?.createdAt ?? new Date().toISOString()
      }));

    const recentOrders = [...safeOrders]
      .sort((a, b) => {
        const dateA = safeDateParse(a?.createdAt);
        const dateB = safeDateParse(b?.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map(order => ({
        id: order?.id ?? 'unknown',
        userName: order?.userName ?? `User ${order?.userId?.substring(0, 6) ?? 'unknown'}`,
        totalAmount: order?.totalAmount ?? 0,
        status: order?.status ?? 'pending',
        createdAt: order?.createdAt ?? new Date().toISOString()
      }));

    // Chart data - monthly orders and revenue
    const monthlyOrdersData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;
      
      const monthOrders = safeOrders.filter(o => {
        const orderDate = safeDateParse(o?.createdAt);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      return {
        month: monthYear,
        orders: monthOrders.length,
        revenue: monthOrders.reduce((sum, o) => sum + (o?.totalAmount ?? 0), 0)
      };
    }).reverse();

    // Order status for pie chart
    const orderStatusData = [
      { name: 'Completed', value: completedOrders },
      { name: 'Pending', value: pendingOrders },
      { name: 'Processing', value: safeOrders.filter(o => o?.status === 'processing').length },
      { name: 'Cancelled', value: safeOrders.filter(o => o?.status === 'cancelled').length },
    ].filter(item => item.value > 0);

    return {
      // Summary metrics
      totalUsers,
      activeUsers,
      sellers,
      newUsersThisMonth,
      totalProducts,
      outOfStockProducts,
      totalServices,
      totalOrders,
      pendingOrders,
      completedOrders,
      monthlyRevenue,
      
      // Chart data
      monthlyOrdersData,
      orderStatusData,
      
      // Table data
      recentUsers,
      recentOrders,
      
      // Recent activities
      recentActivities: [
        { description: `${newUsersThisMonth} new users signed up`, timestamp: new Date().toISOString() },
        { description: `${completedOrders} orders completed`, timestamp: new Date().toISOString() },
        { description: `${outOfStockProducts} products out of stock`, timestamp: new Date().toISOString() },
      ].filter(activity => !activity.description.includes('0'))
    };
  };

  const dashboardData = calculateMetrics();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert severity="error" className="w-full max-w-md">
          {error}
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <CircularProgress />
        <Typography color="textSecondary">Loading dashboard data...</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <Typography variant="h4" component="h1" className="font-bold">
        Admin Dashboard Overview
      </Typography>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users Card */}
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Users</Typography>
            <Typography variant="h4" component="div">
              {dashboardData.totalUsers.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.activeUsers} active • {dashboardData.newUsersThisMonth} new
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.sellers} sellers
            </Typography>
          </CardContent>
        </Card>
        
        {/* Products & Services Card */}
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Products & Services</Typography>
            <Typography variant="h4" component="div">
              {dashboardData.totalProducts.toLocaleString()} products
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.totalServices} services
            </Typography>
            <Typography 
              variant="body2" 
              color={dashboardData.outOfStockProducts > 0 ? "error" : "text.secondary"}
            >
              {dashboardData.outOfStockProducts} out of stock
            </Typography>
          </CardContent>
        </Card>
        
        {/* Orders Card */}
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Orders</Typography>
            <Typography variant="h4" component="div">
              {dashboardData.totalOrders.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.completedOrders} completed
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.pendingOrders} pending
            </Typography>
          </CardContent>
        </Card>
        
        {/* Revenue Card */}
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Monthly Revenue</Typography>
            <Typography variant="h4" component="div">
              ${dashboardData.monthlyRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From {dashboardData.completedOrders} orders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last 30 days
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders & Revenue Chart */}
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardContent>
            <Typography variant="h6" className="mb-4">Monthly Orders & Revenue</Typography>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.monthlyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'Revenue ($)' ? `$${value.toLocaleString()}` : value,
                      name
                    ]}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="orders" 
                    fill="#8884d8" 
                    name="Orders" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="revenue" 
                    fill="#82ca9d" 
                    name="Revenue ($)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardContent>
            <Typography variant="h6" className="mb-4">Order Status Distribution</Typography>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardData.orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Orders']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent>
          <Typography variant="h6" className="mb-4">Recent Users</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`capitalize ${user.role === 'admin' ? 'text-purple-600' : 
                                       user.role === 'seller' ? 'text-blue-600' : 'text-gray-600'}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {safeDateParse(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent>
          <Typography variant="h6" className="mb-4">Recent Orders</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id.substring(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>
                      ${order.totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>
                      {safeDateParse(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent>
          <Typography variant="h6" className="mb-4">Recent Activity</Typography>
          <div className="space-y-3">
            {dashboardData.recentActivities.map((activity, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 ${
                  index < dashboardData.recentActivities.length - 1 ? 'border-b' : ''
                }`}
              >
                <Typography>{activity.description}</Typography>
                <Typography color="textSecondary" variant="body2">
                  {safeDateParse(activity.timestamp).toLocaleString()}
                </Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}