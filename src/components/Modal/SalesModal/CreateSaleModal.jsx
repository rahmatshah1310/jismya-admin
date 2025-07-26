"use client";

import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useCreateSale } from "@/app/api/saleApi";

export default function CreateSaleModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    saleName: "",
    description: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
  });

  const createSale = useCreateSale();
  const isSubmitting = createSale.isPending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("saleName", form.saleName);
      formData.append("description", form.description);
      formData.append("discountPercentage", Number(form.discountPercentage).toString());
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      // ⬇️ capture response from mutateAsync
const res = await createSale.mutateAsync(form);


      toast.success(res?.message || "Sale created successfully!");

      setForm({
        saleName: "",
        description: "",
        discountPercentage: "",
        startDate: "",
        endDate: "",
      });

      onClose();
    } catch (error) {
    console.error("Sale creation error:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="w-full max-w-2xl bg-white text-gray-800 rounded-2xl p-6 shadow-2xl outline-none"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
    >
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-rose-500 via-yellow-400 to-pink-500 text-transparent bg-clip-text">
        🎉 Create New Sale
      </h2>

      <div className="grid gap-4">
        <InputField
          type="text"
          name="saleName"
          placeholder="Sale Name"
          value={form.saleName}
          onChange={handleChange}
          className="border-2 border-pink-400 focus:ring-pink-500 p-2 rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border-2 border-yellow-400 focus:ring-yellow-500 p-2 rounded-lg min-h-[80px]"
        />
        <InputField
          type="number"
          name="discountPercentage"
          placeholder="Discount %"
          value={form.discountPercentage}
          onChange={handleChange}
          className="border-2 border-purple-400 focus:ring-purple-500 p-2 rounded-lg"
        />
        <InputField type="date" name="startDate" value={form.startDate} onChange={handleChange} className="border-2 border-green-400 p-2 rounded-lg" />
        <InputField type="date" name="endDate" value={form.endDate} onChange={handleChange} className="border-2 border-green-400 p-2 rounded-lg" />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="border-pink-500 text-pink-600 hover:bg-pink-100">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="brand"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </Modal>
  );
}
