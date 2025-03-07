"use client"; // Required for client-side interactivity

import Footer from "@/app/components/footer";
import { useState } from "react";

export default function SellerRegistration() {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skill: "",
    experience: "",
    paymentMethod: "",
  });

  // State to manage form errors
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    skill: "",
    experience: "",
    paymentMethod: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number (10 digits required)";
      isValid = false;
    }

    if (!formData.skill.trim()) {
      newErrors.skill = "Skill is required";
      isValid = false;
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
      isValid = false;
    }

    if (!formData.paymentMethod.trim()) {
      newErrors.paymentMethod = "Payment Method is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Submit the form data (e.g., send to an API)
      console.log("Form Data Submitted:", formData);
      alert("Registration Successful!");
      // Reset form after submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        skill: "",
        experience: "",
        paymentMethod: "",
      });
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
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
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

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>
            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Preferred Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.paymentMethod ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select Payment Method</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="PayPal">Cash</option>
              </select>
              {errors.paymentMethod && <p className="text-sm text-red-500 mt-1">{errors.paymentMethod}</p>}
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