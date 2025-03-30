"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function LoginPage() {
  const router = useRouter();

  // State for login form
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number,
          password,
          user_role: "customer", // Include user_role in the request body
        }),
      });

      // Parse the response JSON
      const data = await response.json();

      // Check if the response indicates an error
      if (!response.ok || data.success === "false") {
        // Extract the error message from the response
        const errorMessage = data.error?.[0] || "Login failed. Please check your credentials.";
        throw new Error(errorMessage);
      }

      // If the response is successful, proceed with login
      const token = data.data.token; // Access the token from data.data.token
      Cookies.set("jwt", token); // Save JWT token in cookies
      console.log("Token:", token); // Log the token for debugging
      router.push("/"); // Redirect to home page after successful login
    } catch (err) {
      // Safely handle the error
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please check your credentials.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Error logging in:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
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
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Login
          </button>
        </form>

        {/* Link to Sign-Up Page */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don`&apos;`t have an account?</p>
          <Link
            href="/customer/signup"
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}