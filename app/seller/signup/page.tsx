

"use client"; // Required for client-side interactivity

import Footer from "@/app/components/footer";
import { useState } from "react";

export default function SellerRegistration() {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    country_code: "KE", // Default to Kenya
    password: "",
    user_role: "seller",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  // State to manage form errors
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number (10 digits required)";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      // Submit the form data to the API
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is OK (status code 2xx)
      if (response.ok) {
        // Parse the response as JSON
        const data = await response.json();
        alert("Registration Successful!");
        // Reset form after submission
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          country_code: "KE",
          password: "",
          user_role: "seller",
        });
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        try {
          // Try to parse the response as JSON
          const errorData = JSON.parse(text);
          alert(`Registration Failed: ${errorData.message}`);
        } catch {
          // If parsing fails, display the raw text
          alert(`Registration Failed: ${text}`);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  } else {
    alert("Please fix the errors in the form.");
  }
};

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}

      {/* Main Content */}
      <section className="flex-grow py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Seller Registration</h2>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.full_name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.phone_number && <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>}
            </div>

            {/* Country Code */}
            <div>
              <label htmlFor="country_code" className="block text-sm font-medium text-gray-700">
                Country Code
              </label>
              <select
                id="country_code"
                name="country_code"
                value={formData.country_code}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="KE">Kenya (+254)</option>
                <option value="UG">Uganda (+256)</option>
                <option value="TZ">Tanzania (+255)</option>
                {/* Add more country codes as needed */}
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}