"use client";

import { useState, useEffect } from 'react';
import { CircularProgress, Alert, Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface User {
  id: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  email: string;
  user_role?: string;
}

export default function CustomerReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/user/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setUsers(data.data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const customers = users.filter(user => 
    user.user_role ? user.user_role === 'customer' : true
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add logo
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255); // Blue color
    doc.text('Campus Market (C.M)', 14, 20);
    doc.setTextColor(0, 0, 0); // Reset to black
    
    // Add report title and date
    doc.setFontSize(14);
    doc.text('Customer Report', 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // Add statistics
    doc.setFontSize(12);
    doc.text(`Total Customers: ${customers.length}`, 14, 46);
    doc.text(`Report Period: ${new Date().toLocaleDateString()}`, 14, 54);
    
    // Prepare table data
    const tableData = customers.map(customer => [
      `${customer.first_name} ${customer.last_name || ''}`,
      customer.email,
      customer.phone_number,
      customer.user_role || 'N/A'
    ]);
    
    // Add table using the imported autoTable function
    autoTable(doc, {
      head: [['Name', 'Email', 'Phone', 'Role']],
      body: tableData,
      startY: 60,
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    doc.save('customer_report.pdf');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert severity="error" className="w-full max-w-md">
          {error}
          <button 
            onClick={fetchUsers}
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Reports</h1>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={generatePDF}
          disabled={loading}
        >
          Export to PDF
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-gray-500">Total Customers</h3>
              <p className="text-3xl font-bold">{customers.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-gray-500">Report Date</h3>
              <p className="text-xl">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Customer List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.first_name} {customer.last_name || ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.phone_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.user_role || 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No customers found
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