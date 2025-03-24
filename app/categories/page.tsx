import Link from "next/link";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

// Define the categories
const categories = [
  { id: 1, name: "Graphic Design", icon: "🎨", slug: "graphic-design" },
  { id: 2, name: "Tutoring", icon: "📚", slug: "tutoring" },
  { id: 3, name: "Web Development", icon: "🖥️", slug: "web-development" },
  { id: 4, name: "Photography", icon: "📸", slug: "photography" },
  { id: 5, name: "Writing & Editing", icon: "✍️", slug: "writing-editing" },
  { id: 6, name: "Music & Audio", icon: "🎵", slug: "music-audio" },
  { id: 7, name: "Marketing", icon: "📈", slug: "marketing" },
  { id: 8, name: "Fitness & Wellness", icon: "💪", slug: "fitness-wellness" },
  { id: 9, name: "Others", icon: "➕", slug: "others" }, // Add "Others" category
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow py-16 px-4 md:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Explore Categories</h1>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`} // Link to category-specific page
              className={`bg-white p-6 shadow-md rounded-md text-center hover:shadow-lg transition-shadow ${
                category.slug === "others" ? "border-2 border-dashed border-gray-300" : ""
              }`}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}