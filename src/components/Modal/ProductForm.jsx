"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import Modal from "react-modal";
import MultiSelect from "../ui/MultiSelect";
import { toast } from "react-toastify";
import { useCreateProduct } from "@/app/api/productApi";
import ToggleSwitch from "../ui/ToggleSwitch";

export default function ProductForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    categoryName: "",
    productName: "",
    description: "",
    price: "",
    discount: "",
    sales: 1,
    saleName: "",
    colorsAvailable: [],
    sizesAvailable: [],
    fabrics: "",
    imageUrl: "",
    imageFile: null,
    isActive: true,
  });
  const createProduct = useCreateProduct();
   const isSubmitting = createProduct.isPending;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

    if (!formData.imageFile) {
      toast.error("Image is required.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("productName", formData.productName);
    formPayload.append("categoryName", formData.categoryName);
    formPayload.append("description", formData.description);
    formPayload.append("saleName", formData.saleName);
    formPayload.append("price", formData.price);
    formPayload.append("discount", formData.discount);
    formPayload.append("sales", formData.sales || 1);
    formPayload.append("fabrics", formData.fabrics);
    formPayload.append("isActive", formData.isActive);
    formPayload.append("image", formData.imageFile);

    // Append each color and size individually
    formData.colorsAvailable.forEach((color) => formPayload.append("colorsAvailable[]", color));
    formData.sizesAvailable.forEach((size) => formPayload.append("sizesAvailable[]", size));

    try {
      const res = await createProduct.mutateAsync(formPayload);
      toast.success(res?.message || "Product created successfully!");
      onClose?.();
    } catch (error) {
      console.error("Product creation failed:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    }
  };

  // if (!isOpen) return null;
  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      onRequestClose={onClose}
      contentLabel="View Banner Modal"
      className="bg-white w-full h-[600px] flex flex-col md:max-w-3xl  rounded-lg shadow-lg overflow-y-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center px-4 py-8"
    >
      <form onSubmit={handleSubmit} className="h-auto p-8 space-y-6 bg-gradient-to-tr from-white to-blue-50 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 border-b pb-2">🛍️ Create Product</h2>
        {/* Product Name */}
          <InputField id="productName" name="productName" value={formData.productName} onChange={handleChange} className="border p-2 w-full" label="Product Name"/>
        {/* Category */}
          <InputField id="categoryName"  name="categoryName" value={formData.categoryName} onChange={handleChange} className="border p-2 w-full" label="Category" />
        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Price, Discount, Sales */}
        <div className="grid grid-cols-3 gap-4">
            <InputField id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="border p-2 w-full" label="Price" />
            <InputField id="discount" name="discount" type="number" value={formData.discount} onChange={handleChange} className="border p-2 w-full" label="Discount  (%)" />
            <InputField id="sales" name="sales" type="number" value={formData.sales} onChange={handleChange} className="border p-2 w-full" label="Sales" />
          {/* Sale Name */}
            <InputField
              id="saleName"
              name="saleName"
              value={formData.saleName}
              onChange={handleChange}
              className="border p-2 w-full"
              label="Sale Name"
              placeholder="e.g. Summer Sale"
            />
          {/* Fabrics */}
            <InputField id="fabrics" name="fabrics" value={formData.fabrics} onChange={handleChange} className="border p-2 w-full" label="fabrics" />
        </div>
        {/*Colors */}
        <div>
          <MultiSelect
            label="Colors"
            name="colorsAvailable"
            value={formData.colorsAvailable}
            options={["Red", "Blue", "Black"]}
            onChange={(name, selected) => setFormData((prev) => ({ ...prev, [name]: selected }))}
          />
        </div>

        {/* Sizes */}
        <div>
          <MultiSelect
            label="Sizes"
            name="sizesAvailable"
            value={formData.sizesAvailable}
            options={["S", "M", "L", "XL"]}
            onChange={(name, selected) => setFormData((prev) => ({ ...prev, [name]: selected }))}
          />
        </div>

        {/* Image Display + URL */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Image</label>
          <InputField type="file" accept="image/*" onChange={handleImageSelect} className="border p-2 w-full" />
        </div>

        {/* Active toggle */}
        <ToggleSwitch
          isActive={formData.isActive}
          onToggle={() => setFormData({ ...formData, isActive: !formData.isActive })}
          activeText="Active"
          inactiveText="Inactive"
          className="!ml-0"
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-lg transition-all duration-200">
          {isSubmitting?"Creating...":"💾 Create Product"}
        </Button>
      </form>
    </Modal>
  );
}
