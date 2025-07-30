"use client";

import { useState } from "react";
import { useGetAllSales, useUpdateSaleStatus } from "@/app/api/saleApi";
import Button from "@/components/ui/Button";
import CreateSaleModal from "@/components/Modal/SalesModal/CreateSaleModal";
import DeleteSaleModal from "@/components/Modal/SalesModal/DeleteSaleModal";
import ConnectProductsToSaleModal from "@/components/Modal/SalesModal/ConnectProductToSaleModal";
import UpdateSaleModal from "@/components/Modal/SalesModal/UpdateSaleModal";
import { ClipLoader } from "react-spinners";
import { FaTrash, FaEdit } from "react-icons/fa";
import Image from "next/image";
import StatusToggle from "@/components/ui/common/StatusToggle";

export default function Sales() {
  const { data: sales, isLoading } = useGetAllSales();
  const toggleStatus = useUpdateSaleStatus();

  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleDeleteClick = (sale) => {
    setSelectedSale(sale);
    setDeleteModalOpen(true);
  };
  const handleEditClick = (sale) => {
    setSelectedSale(sale);
    setUpdateModalOpen(true);
  };

  const handleToggle = (id, currentStatus) => {
    toggleStatus.mutate({ id, isActive: !currentStatus });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">All Sales</h2>
        <Button onClick={() => setModalOpen(true)} variant="brand" className="bg-blue-500 text-white rounded">
          + New Sale
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-555px)] md:min-h-[calc(100vh-365px)]">
          <ClipLoader />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sales?.data?.map((sale) => (
            <div
              key={sale._id}
              className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-lg text-white shadow-xl transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Title + Actions */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{sale.saleName}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(sale)} title="Edit Sale" className="text-white hover:text-yellow-300 cursor-pointer">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteClick(sale)} title="Delete Sale" className="text-white hover:text-red-300 cursor-pointer">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  {" "}
                  <p className="text-sm opacity-80">{sale.description}</p>
                  <p className="mt-2">
                    <span className="font-semibold">Discount:</span> {sale.discountPercentage}%
                  </p>
                  <p className="text-sm mt-1">
                    {new Date(sale.startDate).toLocaleDateString()} - {new Date(sale.endDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusToggle id={sale._id} isActive={sale.isActive} mutationFn={({ id, isActive }) => toggleStatus.mutateAsync({ id, isActive })} />
              </div>

              {/* ✅ Product Preview */}
              {sale.products.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {sale.products.map((product) => (
                    <div key={product._id} className="flex gap-4 bg-white bg-opacity-10 p-2 rounded shadow">
                      <Image
                        src={product.productId.imageUrl}
                        alt={product.productId.productName}
                        width={400}
                        height={400}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="text-sm">
                        <h4 className="font-semibold">{product.productId.productName}</h4>
                        <p>
                          <span className="line-through text-gray-300 mr-1">Rs. {product.originalPrice}</span>
                          <span className="text-yellow-300 font-bold">Rs. {product.salePrice}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm italic opacity-60">No products added to this sale yet.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Sale Modal */}
      <CreateSaleModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      {/* Delete Sale Modal */}
      {selectedSale && <DeleteSaleModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} sale={selectedSale} />}

      {/* Update Sale Modal */}
      {selectedSale && <UpdateSaleModal isOpen={updateModalOpen} onClose={() => setUpdateModalOpen(false)} sale={selectedSale} />}
    </div>
  );
}
