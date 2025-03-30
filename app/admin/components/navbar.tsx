"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard,
  Users,
  ShoppingBag,
  LineChart,
  FileText,
  Settings,
  HelpCircle
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin/dashboard"
    },
    {
      name: "Customer Reports",
      icon: <Users className="w-5 h-5" />,
      path: "/admin/customer-reports"
    },
    {
      name: "Seller Reports",
      icon: <ShoppingBag className="w-5 h-5" />,
      path: "/admin/seller-reports"
    },
    {
      name: "Sales Analytics",
      icon: <LineChart className="w-5 h-5" />,
      path: "/admin/sales-analytics"
    },
    {
      name: "System Logs",
      icon: <FileText className="w-5 h-5" />,
      path: "/admin/system-logs"
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/admin/settings"
    }
  ];

  return (
    <div className="hidden border-r bg-gray-50 lg:block w-64">
      <div className="flex flex-col h-full">
        {/* Brand Header */}
        <div className="flex h-16 items-center border-b px-4">
          <Link className="flex items-center gap-2" href="/admin/dashboard">
            <span className="text-lg font-bold text-blue-600">
              Campus Market <span className="text-gray-500">(C.M)</span>
            </span>
          </Link>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                href={item.path}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Help Section */}
        <div className="border-t p-4">
          <Link
            href="/admin/help"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </Link>
        </div>
      </div>
    </div>
  );
}