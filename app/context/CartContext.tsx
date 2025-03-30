"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  totalPrice: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
};

type CartContextType = {
  cartId: string | null;
  cart: CartItem[];
  addToCart: (item: Product) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateCartItemQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchCart = async () => {
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        setCart([]);
        setCartId(null);
        return;
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      // Check for empty cart response
      if (data.id === "00000000-0000-0000-0000-000000000000" && 
          data.user_id === "00000000-0000-0000-0000-000000000000") {
        setCart([]);
        setCartId(null);
        return;
      }
  
      if (!response.ok) {
        throw new Error("Failed to load cart");
      }
  
      // Handle both possible response formats
      setCart(data.cartItems || data.items || []);
      setCartId(data.id || data.cartId || null);
    } catch (error) {
      console.error("Error loading cart:", error);
      setError(error instanceof Error ? error.message : "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const refreshCart = async () => {
    setIsLoading(true);
    await fetchCart();
  };

  const addToCart = async (product: Product) => {
    setIsLoading(true);
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        throw new Error("Please login to add items to cart");
      }

      const existingItem = cart.find(item => item.product_id === product.id);
      const method = existingItem ? "PUT" : "POST";

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/${product.id}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: existingItem ? existingItem.quantity + 1 : 1,
          price: product.price,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      await fetchCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setError(error instanceof Error ? error.message : "Failed to add item to cart");
      setIsLoading(false);
      throw error;
    }
  };

  const removeFromCart = async (id: string) => {
    setIsLoading(true);
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        throw new Error("Please login to modify cart");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/${id}/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      await fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Failed to remove item from cart");
      setIsLoading(false);
      throw error;
    }
  };

  const updateCartItemQuantity = async (id: string, quantity: number) => {
    setIsLoading(true);
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        throw new Error("Please login to update cart");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }

      await fetchCart();
    } catch (error) {
      console.error("Error updating item quantity:", error);
      setError("Failed to update item quantity");
      setIsLoading(false);
      throw error;
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        throw new Error("Please login to clear cart");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Failed to clear cart");
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartId,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        isLoading,
        error,
        clearError,
        refreshCart,
      }}
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