'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useSingleProduct } from '@/app/api/productApi'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import DescriptionImageUploaderModal from '@/components/Modal/ProductModals/DescriptionImageUploaderModal'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/Button'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const [openUploader, setOpenUploader] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data, isLoading, isError } = useSingleProduct(id)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (isError || !data?.data) {
    return (
      <p className="text-red-600 text-center mt-10">Failed to load product.</p>
    )
  }

  const product = data.data
  const allImages = [
    product.imageUrl,
    ...(product.additionalImages?.map((img) => img.imageUrl) || []),
  ]
  const mainImage = allImages[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">🛍 Product Detail</h1>
          <Button
            onClick={() => setOpenUploader(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg"
          >
            Upload Description Image
          </Button>
        </div>

        {/* Product Info Card */}
        <Card className="overflow-hidden shadow-lg text-foreground">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
            {/* Left Column: Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="lg:col-span-2 flex flex-col gap-4">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`cursor-pointer border-2 overflow-hidden transition-all duration-200 ${
                      idx === currentImageIndex
                        ? 'border-blue-500 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <Image
                      src={img}
                      alt={`product-${idx}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-24"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Center Column: Main Product Image with Navigation */}
            <div className="lg:col-span-6 w-full flex justify-center items-center">
              <div className="relative">
                <Image
                  src={mainImage}
                  alt={product.productName}
                  width={600}
                  height={600}
                  className="object-cover border shadow-lg w-[500px] h-[500px]"
                />

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 border"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 border"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  {product.productName}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {product.category?.name}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Pricing
                </h3>
                <div className="flex items-center gap-3">
                  {product.discount > 0 ? (
                    <>
                      <span className="text-2xl font-bold text-foreground">
                        Rs.
                        {(
                          product.price -
                          (product.price * product.discount) / 100
                        ).toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        Rs.{product.price.toFixed(2)}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                        -{product.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-foreground">
                      Rs.{product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Product Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-foreground">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {product.saleName && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 text-foreground">
                      <span className="text-gray-600">Sale</span>
                      <span className="text-foreground font-medium">
                        {product.saleName}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-foreground">
                    <span className="text-gray-600">Fabric</span>
                    <span className="text-foreground font-medium">
                      {product.fabrics}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-foreground">
                    <span className="text-gray-600">Colors</span>
                    <span className="text-foreground font-medium">
                      {product.colorsAvailable.join(', ')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-foreground">
                    <span className="text-gray-600">Sizes</span>
                    <span className="text-foreground font-medium">
                      {product.sizesAvailable.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Reviews Summary */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Customer Reviews
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">⭐</span>
                    <span className="text-lg font-semibold">
                      {product.averageRating}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({product.ratingCount} ratings)
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Total reviews: {product.reviewsCount}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        {product.reviews?.length > 0 && (
          <Card className="p-6 shadow-md">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-2">
                📝 Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.reviews.map((review, idx) => (
                <div
                  key={review._id || idx}
                  className="border rounded-lg p-4 shadow-sm  text-foreground border-foreground"
                >
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-foreground">{review.from}</p>
                  <p className="text-foreground">{review.reviewDescription}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        {openUploader && (
          <DescriptionImageUploaderModal
            productId={id}
            isOpen={openUploader}
            onClose={() => setOpenUploader(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
