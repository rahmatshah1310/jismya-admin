'use client'
import Modal from "react-modal";
import Button from "../ui/Button";
import { useDeleteBannerMutation } from "@/app/api/bannerApi";
import { toast } from "react-toastify";

export default function DeleteBannerModal({ banner, onClose }) {
  if (!banner) return null;
  
  const deleteMutation = useDeleteBannerMutation();
  const isLoading=deleteMutation.isPending;

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
      isOpen={true}
      ariaHideApp={false}
      onRequestClose={onClose}
      className="bg-white w-full flex flex-col md:max-w-md h-auto rounded-lg shadow-lg overflow-hidden outline-none"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center px-4 py-8"
    >
      <div className="p-4 space-y-4 text-center">
        <h2 className="text-2xl font-bold">Are you sure?</h2>
        <p className="text-lg">Do you really want to delete the banner <strong>{banner.heading}</strong>? This action cannot be undone.</p>
        <div className="flex flex-col gap-2 mt-4">
          <Button 
            onClick={handleDelete} 
            disabled={isLoading} 
            className={isLoading?"text-gray-300 bg-red-500 w-full":"bg-red-500 text-white w-full"}
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
