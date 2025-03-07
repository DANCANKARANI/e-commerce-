"use client";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="bg-blue-600 text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Turn Your Skills & Creativity into Income!
        </h1>
        <p className="mt-4 text-lg">
          Sell your skills, buy unique products, and network with fellow students.
        </p>
        <div className="mt-6">
          <button
            className="px-6 py-3 bg-green-500 rounded-md text-lg hover:bg-green-600 transition-colors"
            aria-label="Start Selling"
            onClick={() => router.push("/seller/")}
          >
            Start Selling
          </button>
          <button
            className="ml-4 px-6 py-3 bg-white text-blue-600 rounded-md text-lg hover:bg-gray-100 transition-colors"
            onClick={() => router.push("/products")}
            aria-label="Browse Products"
          >
            Browse Products
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Why Choose Campus Market?</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow-md rounded-md">
            <h3 className="text-xl font-semibold">🛍️ Sell & Buy Easily</h3>
            <p className="text-gray-600 mt-2">
              Offer products & freelance services in one platform.
            </p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-md">
            <h3 className="text-xl font-semibold">💳 Secure Payments</h3>
            <p className="text-gray-600 mt-2">Fast & safe MPESA transactions.</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-md">
            <h3 className="text-xl font-semibold">🚀 Grow Your Business</h3>
            <p className="text-gray-600 mt-2">
              Connect with students & scale your business.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="bg-gray-200 py-16 px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Popular Categories</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 shadow-md rounded-md">🎨 Graphic Design</div>
          <div className="bg-white p-6 shadow-md rounded-md">📚 Tutoring</div>
          <div className="bg-white p-6 shadow-md rounded-md">🖥️ Web Development</div>
          <div className="bg-white p-6 shadow-md rounded-md">🎭 Photography</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 shadow-md rounded-md">🔹 Sign Up</div>
          <div className="bg-white p-6 shadow-md rounded-md">🔹 List Your Skill</div>
          <div className="bg-white p-6 shadow-md rounded-md">🔹 Get Hired & Sell</div>
          <div className="bg-white p-6 shadow-md rounded-md">🔹 Receive Payments</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-200 py-16 px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">What Students Say</h2>
        <div className="mt-6">
          <p className="text-xl text-gray-700 italic">
            "I made my first sale in 24 hours! This platform helped me turn my talent into income."
          </p>
          <p className="mt-2 font-semibold text-blue-600">- Jane K., Student</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold">Ready to Start Selling?</h2>
        <p className="mt-4 text-lg">
          Join thousands of students earning money with their skills.
        </p>
        <button
          className="mt-6 px-6 py-3 bg-green-500 rounded-md text-lg hover:bg-green-600 transition-colors"
          aria-label="Sign Up Now"
        >
          Sign Up Now
        </button>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}