"use client";
import { CartProvider } from "../context/CartContext";

 // Mark this as a client component


export default function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
