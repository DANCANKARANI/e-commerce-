"use client";
import Footer from "@/app/components/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SellerRegistration() {
  const router = useRouter();
  // State to manage form inputs
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    user_role: "seller",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  // State to manage form errors
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    general: "", // For API error messages
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
      general: "",
    });
  };

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First Name is required";
      isValid = false;
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last Name is required";
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
    setErrors({ ...errors, general: "" });

    if (!validateForm()) {
      return;
    }

    try {
      // Submit the form data to the API
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      // First check if the response indicates an error
      if (!response.ok || responseData.success === "false") {
        // Handle specific error cases
        if (responseData.error && Array.isArray(responseData.error)) {
          // Handle array of errors (like ["user with this phone no. already exists"])
          throw new Error(responseData.error.join(", "));
        } else if (responseData.message) {
          throw new Error(responseData.message);
        } else {
          throw new Error("Registration failed. Please try again.");
        }
      }

      // Only proceed if response is successful
      alert("Registration Successful!");
      router.push("/seller");
      console.log(responseData);
      
      // Reset form after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        user_role: "seller",
      });

    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : "Registration failed. Please try again."
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <section className="flex-grow py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Seller Registration</h2>

          {/* Display general errors */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.first_name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.first_name && <p className="text-sm text-red-500 mt-1">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.last_name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.last_name && <p className="text-sm text-red-500 mt-1">{errors.last_name}</p>}
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
                Phone Number (e.g., 0712345678)
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="0712345678"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.phone_number && <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>}
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
                placeholder="Enter your password (min 6 characters)"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Hidden user_role field */}
            <input type="hidden" name="user_role" value={formData.user_role} />

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

      <Footer />
    </div>
  );
}