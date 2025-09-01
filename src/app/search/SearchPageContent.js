"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useProductsByCategory, useProductsBySize, useSearchProducts } from "@/app/api/productApi";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/common/Skeleton";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ProductForm from "@/components/Modal/ProductModals/ProductForm";
import ConnectProductsToSaleModal from '@/components/Modal/SalesModal/ConnectProductToSaleModal'
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get("item") || "";
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const { data, isLoading: loadingSearch, error } = useSearchProducts(item);

  // Extract products from API response safely
  let products = data?.data?.results || [];
  let isLoading = loadingSearch;
  const totalResults = data?.data?.totalResults || products.length;
  const category = searchParams.get('category')
  const size = searchParams.get('size')

  const router = useRouter()
  const { id } = useParams()

  const handleAddToSale = (product) => {
    setSelectedProduct(product)
    setSaleModalOpen(true)
  }

  const handleCardClick = (id) => {
    router.push(`/product/${id}`)
  }

  const { data: categoryFilteredData, isLoading: loadingCategory } =
    useProductsByCategory(category)
  const { data: sizeFilteredData, isLoading: loadingSize } =
    useProductsBySize(size)


    if (category && size) {
      const categoryProducts = categoryFilteredData?.data || [];
      const sizeProducts = sizeFilteredData?.data || [];
      products = categoryProducts.filter((prod) =>
        sizeProducts.some((p) => p._id === prod._id)
      );
      isLoading = loadingCategory || loadingSize;
    } else if (category) {
      products = categoryFilteredData?.data || [];
      isLoading = loadingCategory;
    } else if (size) {
      products = sizeFilteredData?.data || [];
      isLoading = loadingSize;
    }

  const formattedCategoryHeading = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Category`
    : 'All Categories'

  return (
    <DashboardLayout>
    <div className="min-h-screen">
       <div className="flex justify-end items-center flex-wrap gap-4 mb-6">

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-700 text-white rounded"
            >
              Add Product
            </Button>
        </div>
      {/* Search Header */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
              <h1 className="text-3xl font-bold text-bacground mb-2">Search Results</h1>
            {!isLoading && !error && (
              <p className="text-bacground">
                Found {totalResults} products for `{item}`
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center text-bacground py-12">
            <ProductCardSkeleton count={10} />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">Error: {error}</div>
        ) : products.length > 0 ? (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard product={product} key={product._id} onCardClick={handleCardClick} onAddToSale={handleAddToSale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-bacground rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-bacground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-bacground font-medium text-lg mb-2">No products found</p>
            <p className="text-bacground">Try adjusting your search terms or browse our categories</p>
          </div>
        )}
      </div>
        {/* Modals */}
        {isModalOpen && (
          <ProductForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        <ConnectProductsToSaleModal
          isOpen={saleModalOpen}
          onClose={() => setSaleModalOpen(false)}
          productId={selectedProduct?._id}
        />
    </div>
    </DashboardLayout>
  );
}
