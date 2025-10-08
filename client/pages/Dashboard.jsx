import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Water Quality Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Water Quality Index</h2>
            <div className="text-3xl font-bold text-blue-600">85</div>
            <p className="text-gray-600">Good Quality</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">pH Level</h2>
            <div className="text-3xl font-bold text-green-600">7.2</div>
            <p className="text-gray-600">Normal Range</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Temperature</h2>
            <div className="text-3xl font-bold text-orange-600">24C</div>
            <p className="text-gray-600">Optimal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
