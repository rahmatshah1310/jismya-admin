import { useUpdateBannerMutation } from "@/app/api/bannerApi";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

export default function EditBannerModal({ onClose, showEditModal, banner }) {
  const updateBanner = useUpdateBannerMutation();
  const [form, setForm] = useState({
    heading: banner?.heading || "",
    description: banner?.description || "",
    image: null, // Optional new image
    deviceType: banner?.deviceType || "laptop",
  });

  const isSubmitting = updateBanner.isPending;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("heading", form.heading);
    formData.append("description", form.description);
    formData.append("deviceType", form.deviceType);
    if (form.image) formData.append("image", form.image);

    try {
      const res = await updateBanner.mutateAsync({
        id: banner._id,
        data: formData,
      });
      toast.success(res?.message);
      onClose();
    } catch (error) {
      console.error("Update banner error:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    }
  };

  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      onRequestClose={onClose}
      contentLabel="Create Banner Modal"
      className="bg-white w-full flex justify-center  md:max-w-3xl rounded-lg shadow-lg overflow-y-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/10 z-50 flex items-start justify-center px-4 py-8"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg space-y-4 w-full "
      >
        <h2 className="font-bold text-xl mb-4">Edit Banner</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            value={form.heading??""}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
            placeholder="Heading"
            maxLength={200}
            className="border p-2 w-full"
          />
          {/* 
                    <select
                        value={form.deviceType}
                        onChange={(e) => setForm({ ...form, deviceType: e.target.value })}
                        className="border p-2 w-full rounded"
                    >
                        <option value="laptop">Laptop</option>
                        <option value="tablet">Tablet</option>
                        <option value="mobile">Mobile</option>
                    </select> */}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="border p-2 w-full"
          />
        </div>
         <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          ></textarea>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting?"w-full bg-green-500 text-gray-300 p-2 rounded":"w-full bg-green-500 text-white p-2 rounded"}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
        <Button
          onClick={onClose}
          className="w-full bg-gray-300 text-black p-2 rounded"
        >
          Cancel
        </Button>
      </form>
    </Modal>
  );
}
