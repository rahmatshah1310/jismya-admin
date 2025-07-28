import { useCreateBannerMutation } from "@/app/api/bannerApi";
import { useState } from "react";
import Modal from "react-modal";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { toast } from "react-toastify";

export default function CreateBannerModal({
  onClose,
  showCreateModal,
  deviceType,
}) {
  const createBanner = useCreateBannerMutation();
  const [form, setForm] = useState({
    heading: "",
    description: "",
    image: null,
    deviceType: deviceType || "laptop",
  });
  const isSubmitting = createBanner.isPending;
  const resetForm = () => {
    setForm({ heading: "", description: "", image: null, deviceType: "" });
  };

  const dimensionRules = {
    laptop: { width: 1280, height: 720 },
    tablet: { width: 900, height: 300 },
    mobile: { width: 500, height: 200 },
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;
      const { width: reqWidth, height: reqHeight } =
        dimensionRules[form.deviceType];

      if (width !== reqWidth || height !== reqHeight) {
        toast.error(
          `Invalid image dimensions. Required for ${form.deviceType}: ${reqWidth}x${reqHeight}px. Your image is ${width}x${height}px.`
        );
        e.target.value = "";
        return;
      }

      setForm((prev) => ({ ...prev, image: file }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      toast.error("Image should not be empty");
      return;
    }
    const formData = new FormData();
    formData.append("heading", form.heading);
    formData.append("description", form.description);
    formData.append("deviceType", deviceType);
    formData.append("image", form.image);
    try {
      const res = await createBanner.mutateAsync(formData);
      console.log(res.message, "error message");
      toast.success(res?.message || "Banner created successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Banner creation error:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    }
  };

  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      onRequestClose={onClose}
      deviceType="laptop"
      contentLabel="Create Banner Modal"
      className="bg-white w-full flex justify-center  md:max-w-3xl rounded-lg shadow-lg overflow-y-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-start justify-center px-4 py-8"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg space-y-4 w-full "
      >
        <h2 className="font-bold text-xl">Create Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
            placeholder="Heading"
            className="border p-2 w-full"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="border p-2 w-full"
          />

          {/* <div className=" font-medium text-gray-600">
            Device Type:{" "}
            <span className="font-bold capitalize">{deviceType}</span>
          </div> */}
        </div>
        
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          ></textarea>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting?"text-gray-300 bg-green-500 p-2 rounded w-full":"w-full bg-green-500 text-white p-2 rounded "}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
        <Button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="w-full bg-gray-300 text-black p-2 rounded"
        >
          Cancel
        </Button>
      </form>
    </Modal>
  );
}
