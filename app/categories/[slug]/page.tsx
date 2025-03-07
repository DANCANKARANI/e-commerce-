import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import { notFound } from "next/navigation";

// Mock data for persons offering services (you can fetch this from an API)
const personsByCategory = {
    "graphic-design": [
      { id: 1, name: "John Doe", service: "Logo Design", whatsapp: "1234567890" },
      { id: 2, name: "Jane Smith", service: "Poster Design", whatsapp: "0987654321" },
    ],
    tutoring: [
      { id: 3, name: "Alice Johnson", service: "Math Tutoring", whatsapp: "1122334455" },
      { id: 4, name: "Bob Brown", service: "Science Tutoring", whatsapp: "5566778899" },
    ],
    "web-development": [
      { id: 5, name: "Charlie Davis", service: "Frontend Development", whatsapp: "3344556677" },
      { id: 6, name: "Diana Evans", service: "Backend Development", whatsapp: "7788990011" },
    ],
    photography: [
      { id: 7, name: "Ethan Harris", service: "Portrait Photography", whatsapp: "9900112233" },
      { id: 8, name: "Fiona Clark", service: "Event Photography", whatsapp: "4455667788" },
    ],
    "writing-editing": [
      { id: 9, name: "George Lewis", service: "Content Writing", whatsapp: "1122334455" },
      { id: 10, name: "Hannah Walker", service: "Proofreading", whatsapp: "6677889900" },
    ],
    "music-audio": [
      { id: 11, name: "Ian Hall", service: "Music Production", whatsapp: "2233445566" },
      { id: 12, name: "Jessica Young", service: "Audio Editing", whatsapp: "8899001122" },
    ],
    marketing: [
      { id: 13, name: "Kevin King", service: "Social Media Marketing", whatsapp: "3344556677" },
      { id: 14, name: "Laura Scott", service: "SEO Optimization", whatsapp: "7788990011" },
    ],
    "fitness-wellness": [
      { id: 15, name: "Michael Green", service: "Personal Training", whatsapp: "9900112233" },
      { id: 16, name: "Natalie Adams", service: "Yoga Instruction", whatsapp: "4455667788" },
    ],
  } as const;

// Define a type for the valid category slugs
type CategorySlug = keyof typeof personsByCategory;

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Check if the slug is valid
  if (!isValidCategorySlug(slug)) {
    notFound(); // Show a 404 page if the slug is invalid
  }

  // Get the persons for the category
  const persons = personsByCategory[slug];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow py-16 px-4 md:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Service Providers</h1>

        {/* List of Persons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {persons.map((person) => (
            <div key={person.id} className="bg-white p-6 shadow-md rounded-md text-center">
              <h2 className="text-xl font-semibold text-gray-800">{person.name}</h2>
              <p className="text-gray-600">{person.service}</p>
              <a
                href={`https://wa.me/${person.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Helper function to check if a slug is a valid category slug
function isValidCategorySlug(slug: string): slug is CategorySlug {
  return slug in personsByCategory;
}