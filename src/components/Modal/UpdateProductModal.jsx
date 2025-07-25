"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import InputField from "../ui/InputField";
import MultiSelect from "../ui/MultiSelect";
import Button from "../ui/Button";
import { toast } from "react-toastify";
import { useUpdateProduct } from "@/app/api/productApi";
import ToggleSwitch from "../ui/ToggleSwitch";

export default function UpdateProductModal({ isOpen, onClose, product }) {
  const [formData, setFormData] = useState({ ...product, imageFile: null });
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) setFormData({ ...product, imageFile: null });
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("productName", formData.productName);
    formPayload.append("categoryName", formData.categoryName);
    formPayload.append("description", formData.description);
    formPayload.append("price", formData.price);
    formPayload.append("discount", formData.discount);
    formPayload.append("sales", formData.sales);
    formPayload.append("saleName", formData.saleName);
    formPayload.append("fabrics", formData.fabrics);
    formPayload.append("isActive", formData.isActive);
    if (formData.imageFile) {
      formPayload.append("image", formData.imageFile);
    }
    formData.colorsAvailable.forEach((color) => formPayload.append("colorsAvailable[]", color));
    formData.sizesAvailable.forEach((size) => formPayload.append("sizesAvailable[]", size));

    try {
      const res = await updateProduct.mutateAsync({
        id: product._id,
        data: formPayload,
      });
      toast.success(res?.message || "Product updated successfully!");
      onClose?.();
    } catch (error) {
      console.error("Update product error:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="Update Product"
      className="bg-white w-full h-[600px] flex flex-col md:max-w-3xl rounded-lg shadow-lg overflow-y-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center px-4 py-8"
    >
      <form onSubmit={handleSubmit} className="h-auto p-8 space-y-6 bg-gradient-to-tr from-white to-blue-50 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 border-b pb-2">✏️ Update Product</h2>

        {/* Same fields as in ProductForm */}
        {/* Example: */}
        <InputField name="productName" value={formData.productName} onChange={handleChange} className="border p-2 w-full" label="Product Name" />
        <InputField name="categoryName" value={formData.categoryName} onChange={handleChange} className="border p-2 w-full" label="Category" />
        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows={3} />

        <div className="grid grid-cols-3 gap-4">
          <InputField name="price" type="number" value={formData.price} onChange={handleChange} className="border p-2 w-full" label="Price" />
          <InputField name="discount" type="number" value={formData.discount} onChange={handleChange} className="border p-2 w-full" label="Discount" />
          <InputField name="sales" type="number" value={formData.sales} onChange={handleChange} className="border p-2 w-full" label="Sales" />
          <InputField
            id="saleName"
            name="saleName"
            value={formData.saleName}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="e.g. Summer Sale"
            label="Sale Name"
          />
          <InputField name="fabrics" value={formData.fabrics} onChange={handleChange} className="border p-2 w-full" label="Fabrics" />
        </div>

        <MultiSelect
          name="colorsAvailable"
          label="Colors"
          value={formData.colorsAvailable}
          options={["Red", "Blue", "Black"]}
          onChange={(name, selected) => setFormData((prev) => ({ ...prev, [name]: selected }))}
        />
        <MultiSelect
          name="sizesAvailable"
          label="Sizes"
          value={formData.sizesAvailable}
          options={["S", "M", "L", "XL"]}
          onChange={(name, selected) => setFormData((prev) => ({ ...prev, [name]: selected }))}
        />

        <InputField type="file" accept="image/*" onChange={handleImageSelect} className="border p-2 w-full" />

        {/* <div className="flex items-center gap-2">
          <InputField
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">Active</label>
        </div> */}
        <ToggleSwitch
          isActive={formData.isActive}
          onToggle={() => setFormData({ ...formData, isActive: !formData.isActive })}
          activeText="Active"
          inactiveText="Inactive"
          className="!ml-0"
        />

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-lg">
          ✅ Update Product
        </Button>
      </form>
    </Modal>
  );
}
