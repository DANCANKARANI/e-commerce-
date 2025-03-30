"use client";

import { useState } from "react";

interface ShippingAddressProps {
  onNext: (address: Address) => void;
}

interface Address {
  name: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
}

export default function ShippingAddress({ onNext }: ShippingAddressProps) {
  const [address, setAddress] = useState<Address>({
    name: "",
    address: "",
    city: "",
    state: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(address);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Shipping Address</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={address.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
       
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={address.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700"
        >
          Next
        </button>
      </form>
    </div>
  );
}