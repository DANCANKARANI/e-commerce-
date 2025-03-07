"use client";
import React, { useState } from "react";

export const ServiceListingComponent = () => {
  const [image, setImage] = useState<File | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Ensure required fields are filled
    if (!serviceName || !serviceDescription || !hourlyRate) {
      alert("Please fill all required fields.");
      return;
    }

    // Prepare form data (if submitting to backend)
    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("serviceName", serviceName);
    formData.append("serviceDescription", serviceDescription);
    formData.append("hourlyRate", hourlyRate);

    // Simulate submission
    console.log("Submitting:", { serviceName, serviceDescription, hourlyRate, image });

    // Reset form after submission
    setServiceName("");
    setServiceDescription("");
    setHourlyRate("");
    setImage(null);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Listing</h2>
      <p className="text-gray-600 mb-6">Fill out the form below to list your service.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Field */}
        <div>
          <label className="block text-gray-700">Service Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
          {image && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected Image: {image.name}</p>
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-2 h-20 w-20 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Service Name */}
        <div>
          <label className="block text-gray-700">Service Name</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service name"
          />
        </div>

        {/* Service Description */}
        <div>
          <label className="block text-gray-700">Service Description</label>
          <textarea
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service description"
            rows={4}
          />
        </div>

        {/* Hourly Rate */}
        <div>
          <label className="block text-gray-700">Hourly Rate</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hourly rate"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          List Service
        </button>
      </form>
    </div>
  );
};
