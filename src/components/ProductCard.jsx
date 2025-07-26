"use client";

import { useState } from "react";
import { FiEdit, FiTrash2, FiList, FiTag } from "react-icons/fi";
import UpdateProductModal from "./Modal/UpdateProductModal";
import DeleteProductModal from "./Modal/DeleteProductModal";
import ToggleSwitch from "./ui/ToggleSwitch";
import { toast } from "react-toastify";
import ProductOrderModal from "./Modal/ProductOrderModal";

export default function ProductCard({ product, onCardClick,onAddToSale }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <>
      <div
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
        onClick={() => onCardClick(product._id)}
      >
        <div className="relative">
          {/* Product Image */}
          <img src={product.imageUrl} alt={product.productName} className="h-56 w-full object-cover" />
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOrderModal(true);
            }}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600 p-1 rounded-full cursor-pointer"
            title="Set Order"
          >
            <FiList size={16} />
          </button> */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToSale(product); // this will come as prop
            }}
            className="bg-green-100 hover:bg-green-200 text-green-600 p-1 rounded-full cursor-pointer"
            title="Add to Sale"
          >
            <FiTag size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUpdateModal(true);
            }}
            className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-1 rounded-full cursor-pointer"
            title="Edit"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full cursor-pointer"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">{product.productName}</h3>
          </div>

          <p className="text-sm text-gray-500">{product.description}</p>

          <div className="flex flex-wrap items-center gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
                <span className="text-sm text-green-600 font-semibold">${(product.price - (product.price * product.discount) / 100).toFixed(2)}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{product.discount}% OFF</span>
              </>
            ) : (
              <span className="text-sm text-blue-600 font-semibold">${product.price.toFixed(2)}</span>
            )}
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{product.fabrics}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {product.colorsAvailable.map((color, index) => (
              <span
                key={index}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  color === "Red" ? "bg-red-100 text-red-700" : color === "Blue" ? "bg-blue-100 text-blue-700" : "bg-black text-white"
                }`}
              >
                {color}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.sizesAvailable.map((size) => (
              <span key={size} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && <UpdateProductModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} product={product} />}
      {showDeleteModal && <DeleteProductModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} productId={product._id} />}
      {showOrderModal && <ProductOrderModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} product={product} />}
    </>
  );
}
