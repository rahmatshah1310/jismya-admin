"use client";

import Modal from "react-modal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useUpdateSale } from "@/app/api/saleApi";

export default function UpdateSaleModal({ sale, isOpen, onClose }) {
  const [form, setForm] = useState({
    saleName: "",
    description: "",
    discountPercentage: "",
  });

  const updateSaleMutation = useUpdateSale();

  useEffect(() => {
    if (sale) {
      setForm({
        saleName: sale.saleName || "",
        description: sale.description || "",
        discountPercentage: sale.discountPercentage || "",
      });
    }
  }, [sale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.saleName.trim()) return toast.error("Sale name is required.");
    if (!form.discountPercentage) return toast.error("Discount is required.");

    try {
      const res = await updateSaleMutation.mutateAsync({
        id: sale._id,
        data: {
          ...form,
          discountPercentage: parseFloat(form.discountPercentage),
        },
      });

      toast.success(res?.message || "Sale updated successfully!");
      onClose();
    } catch (error) {
      console.error("Update sale error:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fadeIn transition-all"
      overlayClassName="fixed inset-0 bg-black/25  flex items-center justify-center z-50 p-4"
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">✏️ Update Sale</h2>

        <div className="space-y-4">
          <InputField
            label="Sale Name"
            name="saleName"
            value={form.saleName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g. Summer Blast 2025"
          />
          <InputField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Short summary of the sale"
          />
          <InputField
            label="Discount Percentage"
            name="discountPercentage"
            type="number"
            value={form.discountPercentage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g. 20"
            // min="0"
            // max="100"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} className="w-1/3 bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateSaleMutation.isPending} className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white">
            {updateSaleMutation.isPending ? "Updating..." : "Update Sale"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
