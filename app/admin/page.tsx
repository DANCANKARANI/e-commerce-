"use client";

import React, { useState } from "react";
import Footer from "@/app/components/footer";
import Sidebar from "./components/sidebar";
import DashboardComponent from "./components/DashboardComponent";
import CustomerReports from "./components/CustomerReports";

import SellerReports from "./components/SellerReports";
import SalesReports from "./components/SalesReoorts";

export default function AdminDashboard() {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  // Handle component selection from the sidebar
  const handleComponentSelect = (component: string) => {
    setSelectedComponent(component);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar with component selection */}
        <Sidebar onSelect={handleComponentSelect} currentComponent={selectedComponent} />
        <div className="flex-1 bg-gray-100 p-8">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
            {/* Render the selected component */}
            {selectedComponent === "dashboard" && <DashboardComponent />}
            {selectedComponent === "customerReports" && <CustomerReports />}
            {selectedComponent === "sellerReports" && <SellerReports />}
            {selectedComponent === "salesReports" && <SalesReports />}
      
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}