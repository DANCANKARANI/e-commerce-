"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Define the Product interface
interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  is_active: boolean;
  seller_id: string;
  Seller: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    full_name: string;
    email: string;
    password: string;
    address: string;
    city: string;
    postal_code: string;
    location: string;
    phone_number: string;
    user_role: string;
    is_active: boolean;
    reset_code: string;
    code_expiration_time: string;
    Services: null;
    Orders: null;
    Products: null;
  };
}

export default function ViewProducts() {
  // State for products, loading, and error
  const [products, setProducts] = useState<Product[]>([]); // Explicitly type the products state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Track the product being edited

  // Fetch products from the API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`, // Include JWT token for authentication
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      // Parse the response JSON
      const data = await response.json(); // Parse the full response
      if (data.success && data.data) {
        setProducts(data.data); // Set the products state
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again."); // Set error message
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Handle Edit Button Click
  const handleEdit = (product: Product) => {
    setEditingProduct(product); // Set the product to be edited
  };

  // Handle Delete Button Click
  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete product.");
        }

        // Remove the deleted product from the list
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  // Handle Form Submission for Editing
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to update product.");
      }

      // Update the product in the list
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id ? editingProduct : product
        )
      );
      setEditingProduct(null); // Close the edit form
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Products</h1>
      <p className="text-gray-600 mb-6">Here are your listed products.</p>

      {/* Loading state */}
      {loading && <p className="text-gray-600">Loading products...</p>}

      {/* Error state */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display products */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col"
              >
                {/* Product Image */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {/* Product Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-gray-600">Price: KSH {product.price}</p>
                  <p className="text-gray-600">Stock: {product.stock}</p>
                  <p className="text-gray-600">Category: {product.category}</p>
                </div>
                {/* Edit and Delete Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No products found.</p>
          )}
        </div>
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price (KSH)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}