"use client";

import { useState } from "react";
import { useGetAllSales } from "@/app/api/saleApi";
import Button from "@/components/ui/Button";
import CreateSaleModal from "@/components/Modal/SalesModal/CreateSaleModal";
import { ClipLoader } from "react-spinners";

export default function Sales() {
  const { data: sales, isLoading } = useGetAllSales();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">All Sales</h2>
        <Button onClick={() => setModalOpen(true)} variant="brand" className="bg-blue-500 text-white rounded">
          + New Sale
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sales?.data?.map((sale) => (
            <div key={sale._id} className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-lg text-white shadow-xl">
              <h3 className="text-xl font-bold">{sale.saleName}</h3>
              <p className="text-sm opacity-80">{sale.description}</p>
              <p className="mt-2">
                <span className="font-semibold">Discount:</span> {sale.discountPercentage}%
              </p>
              <p className="text-sm mt-1">
                {new Date(sale.startDate).toLocaleDateString()} - {new Date(sale.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <CreateSaleModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
