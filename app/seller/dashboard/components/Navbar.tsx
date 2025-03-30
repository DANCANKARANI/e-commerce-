"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Seller Dashboard</h1>
        <ul className="flex space-x-4 hover:text-blue-200">
          <li>
            Use sidebar to navigate!
          
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;