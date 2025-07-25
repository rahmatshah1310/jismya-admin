'use client'
import { useState } from "react";
import Modal from "react-modal";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { toast } from "react-toastify";
import { useUpdateProductOrder } from "@/app/api/productApi";

export default function ProductOrderModal({ product, onClose,isOpen }) {
  if (!product) return null;
  const [order, setOrder] = useState(product?.order);
  const reOrder= useUpdateProductOrder();
  const isLoading=reOrder.isPending;


  const handleSubmit = (e) => {
    e.preventDefault();
    reOrder.mutate(
      {
        id: product._id,
        data: { order: Number(order) }
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message)
          onClose();
        },
        onError: (error) => {
          console.error("Reorder error:", error);
          toast.error(typeof error === "string" ? error : "Something went wrong.");
        }
      }
    );
};


  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      onRequestClose={onClose}
      className="bg-white w-full flex flex-col md:max-w-md h-auto rounded-lg shadow-lg overflow-hidden outline-none"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center px-4 py-8"
    >
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">Reorder product</h2>
        <InputField
          type="number"
          min={0}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="border p-2 w-full"
        />
        <Button type="submit" disabled={isLoading} className="bg-green-500 text-white w-full">
          {isLoading ? "Saving..." : "Save"}
        </Button>
        <Button onClick={onClose} type="button" className="bg-red-500 text-white w-full">
          Cancel
        </Button>
      </form>
    </Modal>
  );
}
