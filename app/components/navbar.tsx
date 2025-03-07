"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react"; // Import Menu icon for mobile toggle
import { useState } from "react"; // For mobile menu state

export default function Navbar() {
  const { cart } = useCart(); // Get cart state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center fixed w-full top-0 z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">Campus Market</h1>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
          Home
        </Link>
        <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
          Categories
        </Link>
        <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
          How It Works
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
          Contact
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-gray-600 hover:text-blue-600"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Navigation Links */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md py-4 px-8">
          <Link href="/" className="block text-gray-600 hover:text-blue-600 py-2">
            Home
          </Link>
          <Link href="/categories" className="block text-gray-600 hover:text-blue-600 py-2">
            Categories
          </Link>
          <Link href="/how-it-works" className="block text-gray-600 hover:text-blue-600 py-2">
            How It Works
          </Link>
          <Link href="/contact" className="block text-gray-600 hover:text-blue-600 py-2">
            Contact
          </Link>
        </div>
      )}

      {/* Cart and Login */}
      <div className="flex items-center space-x-4">
        <Link href="/cart" className="relative" aria-label="Cart">
          <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {cart.length}
            </span>
          )}
        </Link>
        <button
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          aria-label="Login"
        >
          Login
        </button>
      </div>
    </nav>
  );
}