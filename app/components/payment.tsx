"use client";

import { useState } from "react";

interface PaymentProps {
  onConfirm: () => void;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  totalAmount: number;
}

export default function Payment({ onConfirm, shippingAddress, totalAmount }: PaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      // Initiate STK Push request
      const response = await fetch("/api/initiate-mpesa-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `254${phoneNumber.slice(1)}`, // Convert to Safaricom format (2547XXXXXXXX)
          amount: totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onConfirm(); // Proceed to order confirmation
      } else {
        setError(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Lipa Na M-Pesa</h2>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <p>Total Amount: KES {totalAmount.toFixed(2)}</p>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        <p>{shippingAddress.name}</p>
        <p>{shippingAddress.street}</p>
        <p>
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
        </p>
        <p>{shippingAddress.country}</p>
      </div>

      {/* Payment Form */}
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

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Submit Button */}
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