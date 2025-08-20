'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useSingleProduct } from '@/app/api/productApi'
import { ClipLoader } from 'react-spinners'
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

  const { data, isLoading, isError } = useSingleProduct(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <ClipLoader />
      </div>
    )
  }

  if (isError || !data?.data) {
    return (
      <p className="text-red-600 text-center mt-10">
        ❌ Failed to load product.
      </p>
    )
  }

  const product = data.data

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
        <Card className="overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="w-full h-full">
              <Image
                src={product.imageUrl}
                alt={product.productName}
                width={500}
                height={400}
                className="rounded-xl object-cover border shadow-md w-full h-auto"
              />
            </div>

            <CardContent className="space-y-4 ">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl font-semibold ">
                  {product.productName}
                </CardTitle>
                <CardDescription>{product.categoryName}</CardDescription>
              </CardHeader>

              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Price:</span>{' '}
                  {product.discount > 0 ? (
                    <>
                      <span className="text-gray-400 line-through mr-2">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        $
                        {(
                          product.price -
                          (product.price * product.discount) / 100
                        ).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-blue-600 font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <p>
                  <span className="font-semibold">Discount:</span>{' '}
                  {product.discount}%
                </p>
                <p>
                  <span className="font-semibold">Sales:</span> {product.sales}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Existing Description Images */}
        {product.descriptionImages?.length > 0 && (
          <Card className="p-6 shadow-md">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                📷 Description Images
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {product.descriptionImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`desc-${idx}`}
                  width={300}
                  height={200}
                  className="rounded-lg border shadow-sm object-cover"
                />
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
