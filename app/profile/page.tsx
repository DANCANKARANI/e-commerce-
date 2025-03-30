"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import Navbar from "../components/navbar";
import Footer from "../components/footer";


// API URL
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Define the User interface
interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  profile_photo_path: string;
}

export default function MyProfile() {
  // State for user data, loading, and error
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for editable fields
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    profile_photo_path: "",
  });

  // Fetch user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // Include JWT token for authentication
          },
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        // Parse the response JSON
        const data = await response.json();
        console.log("API Response:", data); // Log the response for debugging

        // Check if the response contains the expected data
        if (!data || !data.data) {
          throw new Error("Invalid response format: Expected data object.");
        }

        // Set the user state and initialize form data
        setUser(data.data);
        setFormData({
          full_name: data.data.full_name || "",
          phone_number: data.data.phone_number || "",
          email: data.data.email || "",
          profile_photo_path: data.data.profile_photo_path || "",
        });
      } catch (err) {
        setError("Failed to fetch user data. Please try again."); // Set error message
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchUser(); // Call the fetch function
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveChanges();
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!user) {
      setError("User data is not available.");
      return;
    }

    try {
      console.log("Sending PUT request with payload:", formData); // Log the payload

      const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("Error response from server:", errorData);
        throw new Error("Failed to update user data.");
      }

      // Parse the response JSON
      const data = await response.json();
      console.log("Response from PUT request:", data); // Log the response
      setUser(data.data); // Update the user state with the new data
      setEditMode(false); // Exit edit mode
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update user data. Please try again."); // Set error message
      console.error("Error updating user data:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />
      <br />
      <br />

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

          {/* Loading state */}
          {loading && <p className="text-gray-600">Loading profile...</p>}

          {/* Error state */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Display user data */}
          {!loading && !error && user && (
            <div>
              {!editMode ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">Full Name: {user.first_name+" "+user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone Number: {user.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email: {user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Profile Photo: {user.profile_photo_path || "Not provided"}</p>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name:</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Profile Photo URL:</label>
                    <input
                      type="text"
                      name="profile_photo_path"
                      value={formData.profile_photo_path}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}