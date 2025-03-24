"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function SignUpPage() {
  const router = useRouter();

  // State for sign-up form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhone] = useState("");
  const [error, setError] = useState("");

  // Handle sign-up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          phone_number,
          user_role: "customer", // Set user role to "customer"
          is_active: true, // Set is_active to true
        }),
      });

      // Parse the response JSON
      const data = await response.json();

      // Check if the response indicates an error
      if (!response.ok || data.success === "false") {
        // Extract the error message from the response
        const errorMessage = data.error?.[0] || "Sign-up failed. Please try again.";
        throw new Error(errorMessage);
      }

      // If the response is successful, proceed with sign-up
      Cookies.set("jwt", data.token); // Save JWT token in cookies
      router.push("/customer"); // Redirect to customer page after sign-up
    } catch (err) {
      // Safely handle the error
      if (err instanceof Error) {
        setError(err.message || "Sign-up failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Error signing up:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h1>

        {/* Sign-Up Form */}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Create a password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={phone_number}
              onChange={(e) => setPhone(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your phone number"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Sign Up
          </button>
        </form>

        {/* Link to Login Page */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link
            href="/customer"
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}