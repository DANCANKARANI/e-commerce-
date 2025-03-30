"use client";

import { useState, useEffect } from "react";
import { CircularProgress} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface User {
  id: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  email: string;
  profile_photo_path?: string;
  user_role?: string;
  is_verified?: boolean;
  verification_status?: string;
  products_count?: number;
  average_rating?: number;
  business_name?: string;
}

export default function SellerReports() {
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
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
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const sellers = users.filter((user) => user.user_role === "seller");

  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    // Add Campus Market (C.M) logo title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255); // Blue color
    doc.text("Campus Market (C.M)", 14, 15);
    doc.setTextColor(0, 0, 0); // Reset to black
    
    // Add report title and generated date
    doc.setFontSize(14);
    doc.text("Seller Reports", 14, 25);
    doc.setFontSize(10);
    doc.text(`Generated Date: ${currentDate}`, 14, 30);

    // Table Headers
    const columns = ["Name", "Email", "Phone"];
    const rows = sellers.map((seller) => [
      `${seller.first_name} ${seller.last_name || ""}`,
      seller.email,
      seller.phone_number,
    ]);

    // Generate Table
    autoTable(doc, {
      startY: 35,
      head: [columns],
      body: rows,
    });

    // Save PDF
    doc.save("Seller_Report.pdf");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Reports</h1>
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export to PDF
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Sellers</h2>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellers.length > 0 ? (
                    sellers.map((seller) => (
                      <tr key={seller.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {seller.first_name} {seller.last_name || ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {seller.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {seller.phone_number}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        No sellers found
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
