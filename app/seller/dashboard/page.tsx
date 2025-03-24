"use client";

import React, { useState } from "react";
import Footer from "@/app/components/footer";
import { Sidebar } from "./components/sidebar";
import Navbar from "./components/Navbar";
import ProductListingComponent from "./components/productListing";
import ServiceListings from "./components/serviceListings";
import { DashboardComponent } from "./components/dashboardComponent";
import ViewProducts from "./components/viewProducts";
import ViewServices from "./components/viewServices";
import MyProfile from "./components/myProfile";

export default function SellerDashboard() {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  // Handle component selection from the sidebar
  const handleComponentSelection = (component: string) => {
    setSelectedComponent(component);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar with component selection */}
        <Sidebar onSelect={handleComponentSelection} />
        <div className="flex-1 bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            {/* Render the selected component */}
            {selectedComponent === "dashboard" && <DashboardComponent />}
            {selectedComponent === "viewProducts" && <ViewProducts />}
            {selectedComponent === "addProducts" && <ProductListingComponent />}
            {selectedComponent === "viewServices" && <ViewServices/>}
            {selectedComponent === "myProfile" && <MyProfile/>}
            {selectedComponent === "addServices" && <ServiceListings />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}