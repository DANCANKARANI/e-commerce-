"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie

// Define the CartItem type based on the backend CartItem model
export type CartItem = {
  id: string; // `id` is a string (UUID)
  productId: string; // `productId` is a string (UUID)
  name: string;
  price: number; // `price` is a number
  image: string;
  quantity: number;
  totalPrice: number; // `totalPrice` is calculated as price * quantity
};

// Define the Product type from the API response (matching the backend Product model)
type Product = {
  id: string; // `id` is a string (UUID)
  name: string;
  price: number; // `price` is a number
  image_url: string; // `image_url` is used instead of `image`
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Product) => Promise<void>; // Accept a Product object
  removeFromCart: (id: string) => Promise<void>; // `id` is a string (UUID)
  updateCartItemQuantity: (id: string, quantity: number) => Promise<void>; // Update item quantity
  clearCart: () => Promise<void>; // Clear the entire cart
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = async (product: Product) => {
    const cartItem: CartItem = {
      id: crypto.randomUUID(), // Generate a unique ID for the cart item
      productId: product.id, // Use the product's UUID
      name: product.name,
      price: product.price, // Use the product's price as a number
      image: product.image_url, // Map `image_url` to `image`
      quantity: 1,
      totalPrice: product.price, // Initialize totalPrice as price * quantity (1)
    };

    try {
      // Get the JWT token from cookies
      const token = Cookies.get("jwt"); // Replace "jwt" with your cookie name

      if (!token) {
        throw new Error("JWT token is missing");
      }

      // Save the cart item to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({
          quantity: cartItem.quantity,
          price: cartItem.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();

      // Update the local cart state with the response from the backend
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.productId === cartItem.productId);
        if (existingItem) {
          return prevCart.map((item) =>
            item.productId === cartItem.productId
              ? { ...item, quantity: item.quantity + 1, totalPrice: item.price * (item.quantity + 1) }
              : item
          );
        }
        return [...prevCart, cartItem];
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string) => {
    try {
      // Get the JWT token from cookies
      const token = Cookies.get("jwt"); // Replace "jwt" with your cookie name

      if (!token) {
        throw new Error("JWT token is missing");
      }

      // Remove the cart item from the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/${id}/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Update the local cart state
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Update item quantity in cart
  const updateCartItemQuantity = async (id: string, quantity: number) => {
    try {
      // Get the JWT token from cookies
      const token = Cookies.get("jwt"); // Replace "jwt" with your cookie name

      if (!token) {
        throw new Error("JWT token is missing");
      }

      // Update the cart item quantity on the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }

      // Update the local cart state
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id
            ? { ...item, quantity, totalPrice: item.price * quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    try {
      // Get the JWT token from cookies
      const token = Cookies.get("jwt"); // Replace "jwt" with your cookie name

      if (!token) {
        throw new Error("JWT token is missing");
      }

      // Clear the cart on the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      // Update the local cart state
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};