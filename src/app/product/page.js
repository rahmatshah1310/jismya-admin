"use client";

import React, { useState } from "react";
import ProductForm from "@/components/Modal/ProductForm";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import { useGetAllProducts } from "../api/productApi";

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useGetAllProducts();
  const products = data?.data || [];



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-700 text-white rounded">Add Product</Button>
      </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* ProductForm Modal */}
      {isModalOpen && (
        <ProductForm
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Product;
