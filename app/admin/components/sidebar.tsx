"use client";

import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  LineChart,
  FileText,
} from "lucide-react";

interface SidebarProps {
  onSelect: (component: string) => void;
  currentComponent: string;
}

export default function Sidebar({ onSelect, currentComponent }: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "customerReports",
      name: "Customer Reports",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "sellerReports",
      name: "Seller Reports",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      id: "salesReports",
      name: "Sales Reports",
      icon: <LineChart className="w-5 h-5" />,
    },
    {
      id: "systemReports",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Campus Market (C.M)</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item.id)}
                className={`w-full text-left px-4 py-2 rounded transition flex items-center gap-3 ${
                  currentComponent === item.id
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}