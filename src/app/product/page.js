'use client'

import React, { useState } from 'react'
import ProductForm from '@/components/Modal/ProductModals/ProductForm'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import {
  useGetAllProducts,
  useProductsByCategory,
  useProductsBySize,
} from '../api/productApi'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import ConnectProductsToSaleModal from '@/components/Modal/SalesModal/ConnectProductToSaleModal'

// Radix UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ProductCardSkeleton } from '@/components/ui/common/Skeleton'

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const searchParams = useSearchParams()
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

  const { data: allProductsData, isLoading: loadingAll } = useGetAllProducts()
  const { data: categoryFilteredData, isLoading: loadingCategory } =
    useProductsByCategory(category)
  const { data: sizeFilteredData, isLoading: loadingSize } =
    useProductsBySize(size)

  let products = allProductsData?.data || []
  let isLoading = loadingAll

  if (category && size) {
    const categoryProducts = categoryFilteredData?.data || []
    const sizeProducts = sizeFilteredData?.data || []

    products = categoryProducts.filter((prod) =>
      sizeProducts.some((p) => p._id === prod._id)
    )
    isLoading = loadingCategory || loadingSize
  } else if (category) {
    products = categoryFilteredData?.data || []
    isLoading = loadingCategory
  } else if (size) {
    products = sizeFilteredData?.data || []
    isLoading = loadingSize
  }

  const formattedCategoryHeading = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Category`
    : 'All Categories'

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <p
            size="6"
            weight="bold"
            color="gray"
            className="font-bold text-lg text-gray-500"
          >
            {formattedCategoryHeading}
          </p>

          <div className="flex items-center gap-3">
            <ProductFilters />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-700 text-white rounded"
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card variant="surface">
            <CardHeader>
              <CardTitle>No products found</CardTitle>
            </CardHeader>
            <CardContent>
              <p size="3" color="gray" className="text-gray-600">
                Try adjusting your filters or add a new product.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onCardClick={handleCardClick}
                onAddToSale={handleAddToSale}
              />
            ))}
          </div>
        )}

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
  )
}

export default Product
