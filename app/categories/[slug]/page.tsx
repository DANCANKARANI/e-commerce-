"use client";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react"; // Import the `use` hook

// Define a type for the service provider
type ServiceProvider = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  User?: {
    phone_number: string;
  }; // Map to the `User` object
};

// Define a type for the valid category slugs
type CategorySlug = string;

// Map slugs to category names
const categoryNames: Record<CategorySlug, string> = {
  "graphic-design": "Graphic Design",
  tutoring: "Tutoring",
  "web-development": "Web Development",
  photography: "Photography",
  "writing-editing": "Writing & Editing",
  "music-audio": "Music & Audio",
  marketing: "Marketing",
  "fitness-wellness": "Fitness & Wellness",
  others: "Others", // Add "Others" category
};

// Predefined categories
const predefinedCategories = [
  "Graphic Design",
  "Tutoring",
  "Web Development",
  "Photography",
  "Writing & Editing",
  "Music & Audio",
  "Marketing",
  "Fitness & Wellness",
];

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap the params object using `React.use()`
  const { slug } = use(params);

  console.log("Slug:", slug); // Debugging: Log the slug

  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/services/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServiceProviders(data); // Assuming the API returns an array of services
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services by category slug
  const filteredServices = serviceProviders.filter((provider) => {
    if (slug === "others") {
      // Return services that don't belong to any predefined category
      return !predefinedCategories.includes(provider.category);
    } else {
      // Return services that match the category slug
      return provider.category.toLowerCase().replace(/ /g, "-") === slug;
    }
  });

  // Check if the slug is valid
  if (!Object.keys(categoryNames).includes(slug)) {
    console.log("Invalid slug:", slug); // Debugging: Log invalid slugs
    notFound(); // Show a 404 page if the slug is invalid
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
      <br />
      <br />

      {/* Main Content */}
      <div className="flex-grow py-16 px-4 md:px-8">
        {/* Back Button */}
        <Link
          href="/categories"
          className="inline-block mb-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          &larr; Back to Categories
        </Link>

        {/* Category Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {categoryNames[slug]} Service Providers
        </h1>

        {/* Loading State */}
        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {/* Error State */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* List of Service Providers */}
        {!loading && !error && (
          <>
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredServices.map((provider) => (
                  <div key={provider.id} className="bg-white p-6 shadow-md rounded-md text-center">
                    <h2 className="text-xl font-semibold text-gray-800">{provider.name}</h2>
                    <p className="text-gray-600">{provider.description}</p>
                    <p className="text-gray-600">KSh {provider.price.toLocaleString()}</p>
                    {provider.User ? (
                      <a
                        href={`https://wa.me/${+254+provider.User.phone_number}?text=Hi,%20I%20am%20interested%20in%20your%20${provider.name}%20service.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                      >
                        Chat on WhatsApp
                      </a>
                    ) : (
                      <p className="text-gray-600 mt-4">Contact information not available</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No service providers found for this category.</p>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}