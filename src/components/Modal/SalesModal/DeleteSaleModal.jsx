'use client';

import Modal from "react-modal";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { useDeleteSale } from "@/app/api/saleApi";

export default function DeleteSaleModal({ sale, onClose,isOpen }) {
  if (!sale) return null;

  const deleteMutation = useDeleteSale();
  const isLoading = deleteMutation.isPending;

  const handleDelete = () => {
    deleteMutation.mutate(sale._id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Sale deleted successfully!");
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
      ariaHideApp={false}
      onRequestClose={onClose}
      className="bg-white w-full flex flex-col md:max-w-md h-auto rounded-lg shadow-lg overflow-hidden outline-none"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center px-4 py-8"
    >
      <div className="p-4 space-y-4 text-center">
        <h2 className="text-2xl font-bold">Are you sure?</h2>
        <p className="text-lg">
          Do you really want to delete the sale <strong>{sale.saleName}</strong>? This action cannot be undone.
        </p>
        <div className="flex flex-col gap-2 mt-4">
          <Button 
            onClick={handleDelete} 
            disabled={isLoading} 
            className="bg-red-500 text-white w-full"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button 
            onClick={onClose} 
            className="bg-gray-300 text-black w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
