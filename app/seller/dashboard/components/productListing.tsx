"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;



export default function ProductListingComponent() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    image: null as File | null,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!productData.category) {
      newErrors.category = "Please select a category";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
      }

      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price.toString());
      formData.append("category", productData.category);
      formData.append("stock", productData.stock.toString());
      if (productData.image) {
        formData.append("image", productData.image);
      }

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Product listed successfully!");
        setProductData({
          name: "",
          description: "",
          price: 0,
          category: "",
          stock: 0,
          image: null,
        });
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }));
        alert(`Failed to list product: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">List a New Product</h2>
      
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
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
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Product Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={productData.description}
          onChange={handleInputChange}
          placeholder="Enter detailed product description"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (ksh) *
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ksh</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              min="0.01"
              step="0.01"
              value={productData.price || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              className={`block w-full pl-7 pr-12 py-2 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>

        {/* Product Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            value={productData.stock || ""}
            onChange={handleInputChange}
            placeholder="Enter available stock"
            className={`mt-1 block w-full px-4 py-2 border ${
              errors.stock ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
        </div>
      </div>

      {/* Product Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <input
          id="category"
          name="category"
          value={productData.category}
          onChange={handleInputChange}
          placeholder="Enter available stock"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors.category ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
        />
         
      </div>

      {/* Product Image */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Product Image *
        </label>
        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed ${
          errors.image ? "border-red-500" : "border-gray-300"
        } rounded-md`}>
          <div className="space-y-1 text-center">
            {productData.image ? (
              <div className="flex flex-col items-center">
                <img 
                  src={URL.createObjectURL(productData.image)} 
                  alt="Preview" 
                  className="h-32 object-contain mb-2"
                />
                <p className="text-sm text-gray-600">{productData.image.name}</p>
                <button
                  type="button"
                  onClick={() => setProductData({...productData, image: null})}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </div>
        </div>
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Processing..." : "List Product"}
        </button>
      </div>
    </form>
  );
}