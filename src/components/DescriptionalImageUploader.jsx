"use client";

import { useRef, useState } from "react";
import { useAddDescriptionImages } from "@/hooks/productHooks";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaUpload, FaTimes, FaSpinner } from "react-icons/fa";

const DescriptionImageUploader = ({ productId }: { productId: string }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { mutate: addImages, isPending } = useAddDescriptionImages();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  };

  const handleFileSelect = (selected: FileList | File[]) => {
    const filesArray = Array.from(selected);
    setFiles((prev) => [...prev, ...filesArray]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = () => {
    if (!files.length) return toast.error("No files selected");

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("productId", productId);

    addImages(formData, {
      onSuccess: () => {
        toast.success("Images uploaded successfully");
        setFiles([]);
        setPreviews([]);
      },
      onError: () => toast.error("Upload failed"),
    });
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 rounded-2xl border border-dashed border-blue-400 bg-blue-50 shadow-lg">
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Add Description Images</h2>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:border-blue-500 transition-all"
      >
        <FaUpload className="w-10 h-10 text-blue-500 mb-2" />
        <p className="text-blue-600">Click or drag & drop images here</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files!)}
        />
      </div>

      {previews.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mt-4 mb-2">Selected Images:</p>
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden border shadow hover:shadow-md transition"
              >
                <Image
                  src={src}
                  alt={`preview-${index}`}
                  width={200}
                  height={150}
                  className="object-cover w-full h-32"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        disabled={isPending || files.length === 0}
        onClick={handleUpload}
        className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow transition-all disabled:opacity-50"
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
      </button>
    </div>
  );
};

export default DescriptionImageUploader;
