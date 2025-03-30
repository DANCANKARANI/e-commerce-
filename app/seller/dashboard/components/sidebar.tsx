"use client";

export const Sidebar = ({ onSelect }: { onSelect: (component: string) => void }) => {
  // Handle logout functionality
  const handleLogout = () => {
    // Add your logout logic here (e.g., clear cookies, redirect to login page)
    console.log("User logged out");
    // Example: Redirect to login page
    window.location.href = "/seller";
  };

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Menu</h2>
      <ul className="space-y-2">
        {/* Dashboard Button */}
        <li>
          <button
            onClick={() => onSelect("dashboard")}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded"
          >
            Dashboard
          </button>
        </li>

        {/* View My Products Button */}
        <li>
          <button
            onClick={() => onSelect("viewProducts")}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded"
          >
            View My Products
          </button>
        </li>

        {/* Add Products Button */}
        <li>
          <button
            onClick={() => onSelect("addProducts")}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded"
          >
            Add Products
          </button>
        </li>

        {/* View My Services Button */}
        <li>
          <button
            onClick={() => onSelect("viewServices")}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded"
          >
            View My Services
          </button>
        </li>

        {/* Add Services Button */}
        <li>
          <button
            onClick={() => onSelect("addServices")}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded"
          >
            Add Services
          </button>
        </li>

        {/* My Profile Button */}
        <li>
          <button
            onClick={() => onSelect("myProfile")}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded"
          >
            My Profile
          </button>
        </li>
      </ul>

      {/* Log Out Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};