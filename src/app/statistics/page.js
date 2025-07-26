"use client";

import { ClipLoader } from "react-spinners";
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import { useProductSaleStats } from "../api/productApi";

const Card = ({ icon: Icon, title, value, color }) => (
  <div className="flex items-center gap-4 bg-white shadow-sm rounded-xl p-4 border border-gray-200 hover:shadow-md transition">
    <div className={`p-2 rounded-full text-white ${color}`}>
      <Icon className="text-lg" />
    </div>
    <div>
      <h4 className="text-gray-500 text-sm">{title}</h4>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function StatisticsPage() {
  const { data, isLoading, isError } = useProductSaleStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">Failed to load statistics</div>;
  }

const { total = {}, byCategory = [] } = data?.data || {};

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Product Statistics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={FaBoxOpen} title="Total Products" value={total.totalProducts} color="bg-blue-500" />
        <Card icon={FaCheckCircle} title="Active Products" value={total.totalActive} color="bg-green-500" />
        <Card icon={FaTimesCircle} title="Inactive Products" value={total.totalInactive} color="bg-red-500" />
      <Card
  icon={FaStar}
  title="Avg Rating"
  value={typeof total.avgRating === "number" ? total.avgRating.toFixed(1) : "0.0"}
  color="bg-yellow-500"
/>

      </div>

      {/* Table View */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Products by Category</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Total</th>
                <th className="text-left p-2">Active</th>
                <th className="text-left p-2">Inactive</th>
                <th className="text-left p-2">Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map((cat) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium">{cat._id}</td>
                  <td className="p-2">{cat.count}</td>
                  <td className="p-2 text-green-600">{cat.activeCount}</td>
                  <td className="p-2 text-red-500">{cat.inactiveCount}</td>
<td className="p-2">
  {typeof cat.avgRating === "number" ? cat.avgRating.toFixed(1) : "0.0"}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
