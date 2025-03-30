"use client";

import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Payment from "../components/payment";
import ShippingAddress from "../components/shippingAddress";
import { useCart, CartItem } from "../context/CartContext";
import { useState } from "react";
import Cookies from "js-cookie";

interface Address {
  name: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
}

export default function Cart() {
  const { cart, removeFromCart, clearCart, cartId } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "payment">("cart");
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const totalAmount = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

  const getAuthToken = () => {
    return Cookies.get("jwt"); // Get JWT from cookies
  };

  const clearServerCart = async () => {
    try {
      if (!cartId) {
        console.warn("No cart ID found - skipping server cart clear");
        return;
      }
      
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/cart/${cartId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to clear server cart");
      }
    } catch (err) {
      console.error("Error clearing server cart:", err);
    }
  };

  const handleProceedToCheckout = () => {
    setCheckoutStep("address");
  };

  const handleAddressSubmit = (address: Address) => {
    setShippingAddress(address);
    setCheckoutStep("payment");
  };

  const createOrder = async () => {
    try {
      if (!shippingAddress) {
        throw new Error("Shipping address is missing");
      }

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formattedShippingAddress = `
        ${shippingAddress.name},
        ${shippingAddress.address},
        ${shippingAddress.city}, ${shippingAddress.state}
        Phone: ${shippingAddress.phoneNumber}
      `.trim();

      const orderData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        shipping_address: formattedShippingAddress,
        payment_method: "mpesa"
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      return await response.json();
    } catch (err) {
      console.error("Order creation error:", err);
      throw err;
    }
  };

  const handleConfirmPayment = async () => {
    try {
      await createOrder();
      await clearServerCart();
      await clearCart();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete order");
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setCheckoutStep("cart");
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 px-8">
        {checkoutStep === "cart" && (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="bg-white shadow-md rounded-md p-4">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">KSh {item.price.toLocaleString()}</p>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                      <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-semibold">Total Amount: KSh {totalAmount.toLocaleString()}</h3>
                  <button
                    onClick={handleProceedToCheckout}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {checkoutStep === "address" && (
          <ShippingAddress onNext={handleAddressSubmit} />
        )}

        {checkoutStep === "payment" && shippingAddress && (
          <>
            <Payment
              onConfirm={handleConfirmPayment}
              shippingAddress={shippingAddress}
              totalAmount={totalAmount}
            />
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}
          </>
        )}
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">Order Successful!</h3>
              <p className="text-gray-600 mt-2">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <div className="mt-6">
                <button
                  onClick={closeSuccessModal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}