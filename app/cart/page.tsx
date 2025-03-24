"use client";

import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Payment from "../components/payment";
import ShippingAddress from "../components/shippingAddress";
import { useCart, CartItem } from "../context/CartContext"; // Import CartItem from context
import { useState } from "react";

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "payment">("cart");
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

  // Calculate total amount
  const totalAmount = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    setCheckoutStep("address");
  };

  const handleAddressSubmit = (address: Address) => {
    setShippingAddress(address);
    setCheckoutStep("payment");
  };

  const handleConfirmPayment = () => {
    // Handle payment logic here (e.g., call an API)
    alert("Payment successful!");
    setCheckoutStep("cart");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Navbar stays at the top */}

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

                {/* Total Amount & Checkout Button */}
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
          <Payment
            onConfirm={handleConfirmPayment}
            shippingAddress={shippingAddress}
            totalAmount={totalAmount} // Pass the actual totalAmount
          />
        )}
      </main>

      <Footer /> {/* Footer stays at the bottom */}
    </div>
  );
}