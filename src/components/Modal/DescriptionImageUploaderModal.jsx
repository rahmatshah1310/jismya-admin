"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FaUpload, FaTimes, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useAddDescriptionImages } from "@/app/api/productApi";
import Button from "@/components/ui/Button";

export default function DescriptionImageUploaderModal({ productId, isOpen, onClose }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const { mutateAsync: addImages, isPending } = useAddDescriptionImages();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  };

  const handleFileSelect = (selected) => {
    const filesArray = Array.from(selected);
    setFiles((prev) => [...prev, ...filesArray]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!files.length) return toast.error("No files selected");

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("productId", productId);

    try {
      const res = await addImages(formData);
      toast.success(res?.message || "Images uploaded successfully!");
      setFiles([]);
      setPreviews([]);
      onClose();
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    }
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="Update Product"
      className="bg-white w-full  flex flex-col md:max-w-3xl rounded-lg shadow-lg overflow-y-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center px-4 py-8"
    >
      <div className="p-8 space-y-6 bg-gradient-to-tr from-white to-blue-50 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 border-b pb-2">🖼️ Upload Description Images</h2>

        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:border-blue-500 transition-all"
        >
          <FaUpload className="w-10 h-10 text-blue-500 mb-2" />
          <p className="text-blue-600">Click or drag & drop images here</p>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
        </div>

        {previews.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mt-4 mb-2">Selected Images:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {previews.map((src, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden border shadow hover:shadow-md transition">
                  <Image src={src} alt={`preview-${index}`} width={200} height={150} className="object-cover w-full h-32" />
                  <Button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                    <FaTimes size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        <Button
           disabled={isPending || files.length === 0}
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-lg transition-all duration-200 flex justify-center items-center gap-2"
        >
          {isPending ? (
            <>
              <FaSpinner className="animate-spin h-5 w-5" />
              Uploading...
            </>
          ) : (
            <>
              <FaUpload className="w-5 h-5" />
              Upload Images
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
}
