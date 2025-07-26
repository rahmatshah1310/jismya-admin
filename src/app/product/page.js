"use client";

import React, { useState } from "react";
import ProductForm from "@/components/Modal/ProductForm";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { useGetAllProducts, useProductsByCategory, useProductsBySize } from "../api/productApi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import ConnectProductsToSaleModal from "@/components/Modal/SalesModal/ConnectProductToSaleModal";

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const { id } = useParams();
  // if (!id || typeof id !== "string") return <p>Invalid Product ID</p>;
  const router = useRouter();
  const category = searchParams.get("category");
  const size = searchParams.get("size");
  const [saleModalOpen, setSaleModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

const handleAddToSale = (product) => {
  setSelectedProduct(product);
  setSaleModalOpen(true);
};

  const handleCardClick = (id) => {
  router.push(`/product/${id}`);
};

  const { data: allProductsData, isLoading: loadingAll, isError: errorAll } = useGetAllProducts();

  const { data: categoryFilteredData, isLoading: loadingCategory, isError: errorCategory } = useProductsByCategory(category);

  const { data: sizeFilteredData, isLoading: loadingSize, isError: errorSize } = useProductsBySize(size);

  let products = allProductsData?.data || [];
  let isLoading = loadingAll;

  if (category && size) {
    // Intersect both filters
    const categoryProducts = categoryFilteredData?.data || [];
    const sizeProducts = sizeFilteredData?.data || [];

    products = categoryProducts.filter((prod) => sizeProducts.some((p) => p._id === prod._id));
    isLoading = loadingCategory || loadingSize;
  } else if (category) {
    products = categoryFilteredData?.data || [];
    isLoading = loadingCategory;
  } else if (size) {
    products = sizeFilteredData?.data || [];
    isLoading = loadingSize;
  }

  const formattedCategoryHeading = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Category` : "All Categories";

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{formattedCategoryHeading}</h1>
        <ProductFilters />
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-700 text-white rounded">
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product}    onCardClick={handleCardClick}  onAddToSale={handleAddToSale}/>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && <ProductForm open={isModalOpen} onClose={() => setIsModalOpen(false)} />}
        <ConnectProductsToSaleModal
  isOpen={saleModalOpen}
  onClose={() => setSaleModalOpen(false)}
  productId={selectedProduct?._id}
/>

    </div>
  );
};

export default Product;
