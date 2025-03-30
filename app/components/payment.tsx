"use client";

import { useState } from "react";

interface PaymentProps {
  onConfirm: () => void;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    phoneNumber: string;
  };
  totalAmount: number;
}

export default function Payment({ onConfirm, shippingAddress, totalAmount }: PaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10 || !phoneNumber.startsWith("07")) {
      setError("Please enter a valid Kenyan phone number (e.g., 07XXXXXXXX).");
      setIsProcessing(false);
      return;
    }

    try {
      // Convert phone number to Safaricom format (2547XXXXXXXX)
      const formattedPhoneNumber = `254${phoneNumber.substring(1)}`;
      
      const response = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cost: totalAmount,
          customer_phone: formattedPhoneNumber,
          account_reference: "Nelius", // Using fixed reference as per your example
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment initiation failed");
      }

      if (data.success) {
        onConfirm();
      } else {
        setError(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Lipa Na M-Pesa</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <p>Total Amount: KES {totalAmount.toFixed(2)}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        <p>{shippingAddress.name}</p>
        <p>{shippingAddress.address}</p>
        <p>
          {shippingAddress.city}, {shippingAddress.state}
        </p>
        <p>Phone: {shippingAddress.phoneNumber}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter your M-Pesa phone number (e.g., 07XXXXXXXX)"
            value={phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button
          type="submit"
          disabled={isProcessing}
          className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isProcessing ? "Processing..." : "Pay with M-Pesa"}
        </button>
      </form>
    </div>
  );
}