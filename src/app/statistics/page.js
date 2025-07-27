"use client";

import { ClipLoader } from "react-spinners";
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaStar, FaTags, FaPercent } from "react-icons/fa";
import { useProductSaleStats } from "../api/productApi";
import { useGetSalesStats } from "../api/saleApi";
import Card from "@/components/Card";



export default function StatisticsPage() {
  const { data, isLoading, isError } = useProductSaleStats();
  const { data: saleStatsData, isLoading: isSalesLoading, isError: isSalesError } = useGetSalesStats();

  if (isLoading || isSalesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} />
      </div>
    );
  }
console.log(saleStatsData,"salesdata............")
  if (isError || isSalesError) {
    return <div className="text-center text-red-500">Failed to load product or sale statistics</div>;
  }

  const { total = {}, byCategory = [] } = data?.data || {};
  const salestats = saleStatsData?.data || {};

  return (
    <div className="p-6 space-y-10">
      {/* Product Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card icon={FaBoxOpen} title="Total Products" value={total.totalProducts} color="bg-blue-500" />
          <Card icon={FaCheckCircle} title="Active Products" value={total.totalActive} color="bg-green-500" />
          <Card icon={FaTimesCircle} title="Inactive Products" value={total.totalInactive} color="bg-red-500" />
          <Card icon={FaStar} title="Avg Rating" value={typeof total.avgRating === "number" ? total.avgRating.toFixed(1) : "0.0"} color="bg-yellow-500" />
        </div>
      </div>

      {/* Sale Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sales Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card icon={FaTags} title="Total Sales" value={salestats.totalSales} color="bg-indigo-500" />
          <Card icon={FaCheckCircle} title="Active Sales" value={salestats.activeSales} color="bg-emerald-500" />
          <Card icon={FaBoxOpen} title="Products on Sale" value={salestats.totalProductsOnSale} color="bg-pink-500" />
          <Card icon={FaPercent} title="Avg Discount (%)" value={`${salestats.avgDiscount.toFixed(1)}%`} color="bg-orange-500" />
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Products by Category</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className=" p-2">Category</th>
                <th className=" p-2">Total</th>
                <th className=" p-2">Active</th>
                <th className=" p-2">Inactive</th>
                <th className=" p-2 min-w-[90px]">Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map((cat) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium">{cat._id}</td>
                  <td className="p-2">{cat.count}</td>
                  <td className="p-2 text-green-600">{cat.activeCount}</td>
                  <td className="p-2 text-red-500">{cat.inactiveCount}</td>
                  <td className="p-2 ">{typeof cat.avgRating === "number" ? cat.avgRating.toFixed(1) : "0.0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
