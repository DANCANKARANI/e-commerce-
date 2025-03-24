"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from '../context/CartContext';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string; // Add description for more details
  category?: string; // Add category for more details
  stock?: number; // Add stock for more details
};

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Product() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Track selected product for modal

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data); // Access the `data` field from the API response
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product); // Pass the `Product` object directly
    alert(`${product.name} added to cart!`);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product); // Set the selected product for the modal
  };

  const closeModal = () => {
    setSelectedProduct(null); // Close the modal
  };

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <section className="py-16 px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">Browse Products</h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-md p-4">
            <div className="relative w-full h-40">
              <Image 
                src={product.image_url} // Use `image_url` from the API response
                alt={product.name} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-md" 
              />
            </div>
            <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
            <p className="text-gray-600">KSh {product.price.toLocaleString()}</p> {/* Format price */}
            <div className="mt-4 flex justify-between">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                onClick={() => handleViewDetails(product)} // Open modal on click
              >
                View Details
              </button>
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded-md text-sm"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            <div className="relative w-full h-64 mb-4">
              <Image 
                src={selectedProduct.image_url} 
                alt={selectedProduct.name} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-md" 
              />
            </div>
            <p className="text-gray-700 mb-2"><strong>Price:</strong> KSh {selectedProduct.price.toLocaleString()}</p>
            {selectedProduct.description && (
              <p className="text-gray-700 mb-2"><strong>Description:</strong> {selectedProduct.description}</p>
            )}
            {selectedProduct.category && (
              <p className="text-gray-700 mb-2"><strong>Category:</strong> {selectedProduct.category}</p>
            )}
            {selectedProduct.stock && (
              <p className="text-gray-700 mb-4"><strong>Stock:</strong> {selectedProduct.stock} available</p>
            )}
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
              onClick={closeModal} // Close modal on click
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}