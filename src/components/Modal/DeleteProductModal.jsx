"use client";

import Modal from "react-modal";
import Button from "../ui/Button";
import { toast } from "react-toastify";

export default function DeleteProductModal({ isOpen, onClose, productId }) {

   const handleDelete = () => {
    deleteMutation.mutate(banner, {
      onSuccess: (res) => {
        toast.success(res?.message || "Banner deleted successfully!");
        onClose();
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toast.error(typeof error === "string" ? error : "Something went wrong.");
      }
    });
  };



  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="Delete Product"
      className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold text-red-600">Are you sure?</h2>
      <p className="mt-4 text-gray-700">This action cannot be undone.</p>

      <div className="mt-6 flex justify-end gap-4">
        <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black">
          Cancel
        </Button>
        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
          🗑️ Delete
        </Button>
      </div>
    </Modal>
  );
}
