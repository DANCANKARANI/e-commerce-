"use client";

import React, { useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function ProductListingComponent() {
  // State to manage product form inputs
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    image: null as File | null, // Store the image file
  });

  // State to manage form errors
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  // Handle input changes for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductData({
        ...productData,
        image: e.target.files[0],
      });
      setErrors({
        ...errors,
        image: "",
      });
    }
  };

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!productData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!productData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (productData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      isValid = false;
    }

    if (!productData.category.trim()) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (productData.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
      isValid = false;
    }

    if (!productData.image) {
      newErrors.image = "Image is required";
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
        // Retrieve the JWT from cookies
        const token = Cookies.get("jwt"); // Replace "jwt" with your cookie name

        if (!token) {
          alert("You are not authenticated. Please log in.");
          return;
        }

        // Create a FormData object to send the file and other fields
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("price", productData.price.toString());
        formData.append("category", productData.category);
        formData.append("stock", productData.stock.toString());
        if (productData.image) {
          formData.append("image", productData.image);
        }

        // Submit the form data to the API
        const response = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
          },
          body: formData, // Send as FormData
        });

        if (response.ok) {
          const data = await response.json();
          alert("Product listed successfully!");
          // Reset form after submission
          setProductData({
            name: "",
            description: "",
            price: 0,
            category: "",
            stock: 0,
            image: null,
          });
        } else {
          const text = await response.text();
          try {
            const errorData = JSON.parse(text);
            alert(`Failed to list product: ${errorData.message}`);
          } catch {
            alert(`Failed to list product: ${text}`);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={productData.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Product Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={productData.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Product Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={productData.price}
          onChange={handleInputChange}
          placeholder="Enter product price"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors.price ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
      </div>

      {/* Product Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={productData.category}
          onChange={handleInputChange}
          placeholder="Enter product category"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors.category ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
      </div>

      {/* Product Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={productData.stock}
          onChange={handleInputChange}
          placeholder="Enter available stock"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors.stock ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
      </div>

      {/* Product Image */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className={`mt-1 block w-full px-4 py-2 border ${
            errors.image ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          List Product
        </button>
      </div>
    </form>
  );
}