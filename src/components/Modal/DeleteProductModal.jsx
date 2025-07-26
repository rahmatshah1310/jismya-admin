"use client";

import Modal from "react-modal";
import Button from "../ui/Button";
import { toast } from "react-toastify";
import { useDeleteSingleProduct } from "@/app/api/productApi";

export default function DeleteProductModal({ isOpen, onClose, productId }) {
  const deleteMutation = useDeleteSingleProduct();
  const isLoading = deleteMutation.isPending;
  const handleDelete = () => {
    deleteMutation.mutate(productId, {
      onSuccess: (res) => {
        toast.success(res?.message || "Product deleted successfully!");
        onClose();
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toast.error(typeof error === "string" && error);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="Delete Product"
      className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg outline-none text-center"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center p-4"
    >
      <h2 className="text-xl font-bold text-red-600">Are you sure?</h2>
      <p className="mt-4 text-gray-700">This action cannot be undone.</p>

      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black">
          Cancel
        </Button>
        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
          {isLoading ? "Deleting..." : "  🗑️ Delete"}
        </Button>
      </div>
    </Modal>
  );
}
