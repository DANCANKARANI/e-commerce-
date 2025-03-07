import  Link  from "next/link";

export const Sidebar = () => {
    return (
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>
          </li>
          <li>
            <Link href="/dashboard/services" className="text-gray-700 hover:text-blue-600">
              Services
            </Link>
          </li>
          <li>
            <Link href="/dashboard/orders" className="text-gray-700 hover:text-blue-600">
              Orders
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings" className="text-gray-700 hover:text-blue-600">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    );
  };