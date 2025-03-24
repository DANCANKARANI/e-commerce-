"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Define the Service interface
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  seller_id: string;
}

export default function ViewServices() {
  // State for services, loading, and error
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for editing a service
  const [editService, setEditService] = useState<Service | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    is_active: true,
  });

  // Fetch services from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to fetch services.");
        }

        // Parse the response JSON
        const data = await response.json();
        console.log("API Response:", data); // Log the response for debugging

        // Validate the response
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          throw new Error("Invalid response format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to fetch services. Please try again.");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle editing a service
  const handleEdit = (service: Service) => {
    setEditService(service);
    setEditFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      is_active: service.is_active,
    });
  };

  // Handle form input changes for editing
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle saving changes to a service
  const handleSaveChanges = async () => {
    if (!editService) {
      setError("No service selected for editing.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/services/${editService.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to update service.");
      }

      // Parse the response JSON
      const updatedService = await response.json();

      // Update the services state
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === editService.id ? updatedService : service
        )
      );

      // Exit edit mode
      setEditService(null);
      alert("Service updated successfully!");
    } catch (err) {
      setError("Failed to update service. Please try again.");
      console.error("Error updating service:", err);
    }
  };

  // Handle deleting a service
  const handleDelete = async (serviceId: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`${API_URL}/services/${serviceId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to delete service.");
        }

        // Remove the deleted service from the state
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== serviceId)
        );
        alert("Service deleted successfully!");
      } catch (err) {
        setError("Failed to delete service. Please try again.");
        console.error("Error deleting service:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Services</h1>

        {/* Loading state */}
        {loading && <p className="text-gray-600">Loading services...</p>}

        {/* Error state */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display services */}
        {!loading && !error && (
          <div className="space-y-4">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  {editService?.id === service.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Name:
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Description:
                        </label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Price:
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Category:
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleSaveChanges}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditService(null)}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {service.name}
                      </h2>
                      <p className="text-gray-600">{service.description}</p>
                      <p className="text-gray-600">Price: ${service.price}</p>
                      <p className="text-gray-600">Category: {service.category}</p>
                      <div className="flex space-x-4 mt-4">
                        <button
                          onClick={() => handleEdit(service)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No services found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}