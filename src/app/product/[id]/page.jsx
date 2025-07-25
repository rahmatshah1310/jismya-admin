"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useSingleProduct } from "@/app/api/productApi";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import Button from "@/components/ui/Button";
import DescriptionImageUploaderModal from "@/components/Modal/DescriptionImageUploaderModal";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [openUploader, setOpenUploader] = useState(false);

  const { data, isLoading, isError } = useSingleProduct(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <ClipLoader />
      </div>
    );
  }

  if (isError || !data?.data) {
    return <p className="text-red-600 text-center mt-10">❌ Failed to load product.</p>;
  }

  const product = data.data;

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">🛍 Product Detail</h1>
        <Button onClick={() => setOpenUploader(true)} className="bg-blue-700 text-white rounded">
          Upload Description Image
        </Button>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl p-6 shadow-md">
        <Image
          src={product.imageUrl}
          alt={product.productName}
          width={500}
          height={400}
          className="rounded-xl object-cover border shadow"
        />
        <div className="space-y-4 text-gray-700">
          <p><span className="font-semibold">Name:</span> {product.productName}</p>
          <p><span className="font-semibold">Category:</span> {product.categoryName}</p>
          <p><span className="font-semibold">Price:</span> ${product.price}</p>
          <p><span className="font-semibold">Discount:</span> {product.discount}%</p>
          <p><span className="font-semibold">Sales:</span> {product.sales}</p>
        </div>
      </div>

      {/* Existing Description Images */}
      {product.descriptionImages?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">📷 Description Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {product.descriptionImages.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`desc-${idx}`}
                width={300}
                height={200}
                className="rounded-lg border shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal for Description Image Upload */}
      {openUploader && (
        <DescriptionImageUploaderModal
          productId={id}
          isopen={openUploader}
          onClose={() => setOpenUploader(false)}
        />
      )}
    </div>
  );
}
