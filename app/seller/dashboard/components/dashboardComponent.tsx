export const DashboardComponent = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome to your seller dashboard!</p>
  
        {/* Placeholder content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Total Products</h2>
            <p className="text-3xl font-bold text-blue-800">25</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Total Services</h2>
            <p className="text-3xl font-bold text-green-800">12</p>
          </div>
        </div>
      </div>
    );
  };