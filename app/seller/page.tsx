"use client";
import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
    user_role: "seller"
  });
  const [errors, setErrors] = useState({
    phone_number: "",
    password: "",
    general: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
      general: ""
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ ...errors, general: "" });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: formData.phone_number,
          password: formData.password,
          user_role: formData.user_role
        }),
      });

      const responseData = await response.json();

      // First check if the response indicates an error
      if (!response.ok || responseData.success === "false") {
        // Handle specific error cases
        if (responseData.error && Array.isArray(responseData.error)) {
          // Handle array of errors (like ["user does not exist"])
          throw new Error(responseData.error.join(", "));
        } else if (responseData.message) {
          throw new Error(responseData.message);
        } else {
          throw new Error("Login failed. Please try again.");
        }
      }

      // Only proceed if response is successful and contains token
      if (responseData.data && responseData.data.token) {
        Cookies.set("jwt", responseData.data.token, { expires: 1 });
        router.push("/seller/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : "Login failed. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpRedirect = () => {
    router.push("/seller/signup");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="flex-grow py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Seller Login</h2>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-6">
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
                placeholder="07XXXXXXXX"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.phone_number && (
                <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>
              )}
            </div>

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

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

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

      <Footer />
    </div>
  );
}