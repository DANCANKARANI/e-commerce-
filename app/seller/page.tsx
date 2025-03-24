"use client"; // Required for client-side interactivity

import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function LoginPage() {
  const router = useRouter();

  // State to manage login form inputs
  const [formData, setFormData] = useState({
    phone_number: "", // Use phone_number to match API format
    password: "",
  });

  // State to manage login form errors
  const [errors, setErrors] = useState({
    phone_number: "",
    password: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate login form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate phone number
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number (10 digits required)";
      isValid = false;
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
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
        console.log("Submitting form data:", formData); // Debug: Log form data

        // Submit the form data to the API
        const response = await fetch(`${API_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: formData.phone_number, // Use phone_number to match API format
            password: formData.password,
          }),
        });

        console.log("Response status:", response.status); // Debug: Log response status

        if (response.ok) {
          const data = await response.json();
          console.log("Login successful:", data); // Debug: Log success response

          // Extract the token from the response
          const token = data.data.token;

          // Save the token to cookies
          Cookies.set("jwt", token, { expires: 1 }); // Expires in 1 day

          // Reset form after submission
          setFormData({
            phone_number: "",
            password: "",
          });

          // Redirect to the seller dashboard after successful login
          console.log("Redirecting to /seller/dashboard");
          router.push("/seller/dashboard");
        } else {
          const text = await response.text();
          console.log("Login failed:", text); // Debug: Log failure response
          try {
            const errorData = JSON.parse(text);
            alert(`Login Failed: ${errorData.message}`);
          } catch {
            alert(`Login Failed: ${text}`);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error); // Debug: Log any errors
        alert("An error occurred while submitting the form.");
      }
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  // Redirect to the registration page
  const handleSignUpRedirect = () => {
    router.push("seller/signup"); // Replace with your registration page route
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <section className="flex-grow py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-md mx-auto">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-6">
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
              {errors.phone_number && (
                <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>
              )}
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
                Login
              </button>
            </div>
          </form>

          {/* Sign Up Message */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleSignUpRedirect}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}