"use client";


import ProductListingComponent from "@/app/components/productListing";
import React, { useState } from "react";
import Navbar from "./Navbar";

import { Sidebar } from "./sidebar";
import { ServiceListingComponent } from "@/app/components/serviceListing";
import Footer from "@/app/components/footer";


export default function SellerDashboard() {
  const [listingType, setListingType] = useState("");

  const handleSelection = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setListingType(event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
      <Sidebar/>
        <div className="flex-1 bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">List a Product or Service</h1>
            <p className="text-gray-600 mb-6">What would you like to list?</p>

            {/* Dropdown for selecting listing type */}
            <select
              onChange={handleSelection}
              value={listingType}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
            >
              <option value="">Select an option</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>

            {/* Conditionally render the selected component */}
            {listingType === "product" && <ProductListingComponent />}
            {listingType === "service" && <ServiceListingComponent />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}