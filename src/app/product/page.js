"use client";

import React, { useState } from "react";
import ProductForm from "@/components/Modal/ProductModals/ProductForm";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { useGetAllProducts, useProductsByCategory, useProductsBySize } from "../api/productApi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import ConnectProductsToSaleModal from "@/components/Modal/SalesModal/ConnectProductToSaleModal";

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const size = searchParams.get("size");

  const router = useRouter();
  const { id } = useParams();

  const handleAddToSale = (product) => {
    setSelectedProduct(product);
    setSaleModalOpen(true);
  };

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
  };

  const { data: allProductsData, isLoading: loadingAll } = useGetAllProducts();
  const { data: categoryFilteredData, isLoading: loadingCategory } = useProductsByCategory(category);
  const { data: sizeFilteredData, isLoading: loadingSize } = useProductsBySize(size);

  let products = allProductsData?.data || [];
  let isLoading = loadingAll;

  if (category && size) {
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
        {/* <div className="flex items-center gap-2"> */}
        <h1 className="text-3xl font-bold text-gray-800">{formattedCategoryHeading}</h1>
        {/* {isLoading && <ClipLoader size={20} />} */}
        {/* </div> */}

        <ProductFilters />
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-700 text-white rounded">
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-555px)] md:min-h-[calc(100vh-365px)]">
          <ClipLoader />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 min-h-[40vh]">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onCardClick={handleCardClick} onAddToSale={handleAddToSale} />
          ))}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && <ProductForm open={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      <ConnectProductsToSaleModal isOpen={saleModalOpen} onClose={() => setSaleModalOpen(false)} productId={selectedProduct?._id} />
    </div>
  );
};

export default Product;
