"use client"; // Ensure this is at the top

import Image from "next/image";
import { useCart } from '../context/CartContext';

type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity?: number; // Ensure quantity exists in type
};

const products: Product[] = [
  {
    id: 1,
    name: "Custom T-Shirt Design",
    price: "KSh 1,500",
    image: "/images/tshirt.jpg",
  },
  {
    id: 2,
    name: "Web Development Services",
    price: "KSh 5,000",
    image: "/images/webdev.jpg",
  },
  {
    id: 3,
    name: "Handmade Jewelry",
    price: "KSh 2,000",
    image: "/images/jewelry.jpg",
  },
  {
    id: 4,
    name: "Graphic Design Logo",
    price: "KSh 3,000",
    image: "/images/logo.jpg",
  },
];

export default function Product() {
  const { addToCart } = useCart(); // useCart can now be used

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 }); // Ensure quantity is added
    alert(`${product.name} added to cart!`);
  };

  return (
    <section className="py-16 px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">Browse Products</h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-md p-4">
            <div className="relative w-full h-40">
              <Image 
                src={product.image} 
                alt={product.name} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-md" 
              />
            </div>
            <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
            <div className="mt-4 flex justify-between">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">View Details</button>
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
    </section>
  );
}
