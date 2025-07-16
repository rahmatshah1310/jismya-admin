import { useReorderBannerMutation } from "@/app/api/bannerApi";
import { useState } from "react";
import Modal from "react-modal"
import InputField from "../ui/InputField";
import Button from "../ui/Button";

export default function ReorderBannerModal({ banner, onClose }) {
  if (!banner) return null; // ✅ clean early return
  const [order, setOrder] = useState(banner?.order || 0);
  const reorderBanner = useReorderBannerMutation();
  console.log(order, "order.................................")

  const handleSubmit = (e) => {
    e.preventDefault()
    reorderBanner.mutate({
      id: banner._id,
      data: { order: Number(order) }
    });
  };

  return (
    <Modal isOpen={true} ariaHideApp={false} onRequestClose={onClose} className="bg-white w-full flex flex-col md:max-w-md h-auto rounded-lg shadow-lg overflow-hidden outline-none" overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">Reorder Banner</h2>
        <InputField
          type="number"
          min={0}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="border p-2 w-full"
        />
        <Button type="submit" className="bg-green-500 text-white w-full">Save</Button>
        <Button onClick={onClose} className="bg-red-500 text-white w-full">Cancel</Button>
      </form>
    </Modal>
  );
}

