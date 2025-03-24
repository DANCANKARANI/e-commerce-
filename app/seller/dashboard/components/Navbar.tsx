"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Seller Dashboard</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/dashboard" className="hover:text-blue-200">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard/products" className="hover:text-blue-200">
              Products
            </Link>
          </li>
          <li>
            <Link href="/dashboard/services" className="hover:text-blue-200">
              Services
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;