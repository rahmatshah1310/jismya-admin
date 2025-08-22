'use client'

import { useState } from 'react'
import { useGetAllSales, useUpdateSaleStatus } from '@/app/api/saleApi'
import CreateSaleModal from '@/components/Modal/SalesModal/CreateSaleModal'
import DeleteSaleModal from '@/components/Modal/SalesModal/DeleteSaleModal'
import UpdateSaleModal from '@/components/Modal/SalesModal/UpdateSaleModal'
import { FaTrash, FaEdit, FaTags } from 'react-icons/fa'
import Image from 'next/image'
import StatusToggle from '@/components/ui/common/StatusToggle'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { SalesCardSkeleton } from '@/components/ui/common/Skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Sales() {
  const { data: sales, isLoading } = useGetAllSales()
  const toggleStatus = useUpdateSaleStatus()

  const [isModalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)

  const handleDeleteClick = (sale) => {
    setSelectedSale(sale)
    setDeleteModalOpen(true)
  }
  const handleEditClick = (sale) => {
    setSelectedSale(sale)
    setUpdateModalOpen(true)
  }

  const handleToggle = (id, currentStatus) => {
    toggleStatus.mutate({ id, isActive: !currentStatus })
  }

  // 🎨 Color palette for cards (rotates per index)
  const cardColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-orange-500 to-orange-600',
    'from-purple-500 to-purple-600',
  ]

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Sales Management
          </h2>
          <Button
            onClick={() => setModalOpen(true)}
            variant="brand"
            className="bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            + New Sale
          </Button>
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SalesCardSkeleton key={i} />
            ))}
          </div>
        ) : !sales?.data || sales.data.length === 0 ? (
          <Card className="text-center p-2">
            <CardTitle>No sales found</CardTitle>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sales?.data?.map((sale, idx) => (
              <div
                key={sale._id}
                className={`bg-gradient-to-br ${
                  cardColors[idx % cardColors.length]
                }
                p-5 rounded-xl text-white shadow-lg hover:shadow-2xl transition transform hover:scale-[1.02]`}
              >
                {/* Title + Actions */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <FaTags /> {sale.saleName}
                    </h3>
                    <p className="text-sm opacity-80">{sale.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(sale)}
                      title="Edit Sale"
                      className="text-white hover:text-yellow-300"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(sale)}
                      title="Delete Sale"
                      className="text-white hover:text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Sale Details */}
                <div className="flex justify-between items-center text-sm mb-4">
                  <div>
                    <p>
                      <span className="font-semibold">Discount:</span>{' '}
                      {sale.discountPercentage}%
                    </p>
                    <p className="opacity-90">
                      {new Date(sale.startDate).toLocaleDateString()} -{' '}
                      {new Date(sale.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusToggle
                    id={sale._id}
                    isActive={sale.isActive}
                    mutationFn={({ id, isActive }) =>
                      toggleStatus.mutateAsync({ id, isActive })
                    }
                  />
                </div>

                {/* Product Preview */}
                {sale.products.length > 0 ? (
                  <div className="grid gap-2">
                    {sale.products.map((product) => (
                      <div
                        key={product._id}
                        className="flex gap-3 bg-white bg-opacity-20 p-2 rounded-lg items-center"
                      >
                        <Image
                          src={product.productId.imageUrl}
                          alt={product.productId.productName}
                          width={60}
                          height={60}
                          className="w-14 h-14 object-cover rounded-lg border border-white/30"
                        />
                        <div className="text-sm">
                          <h4 className="font-semibold">
                            {/* {product.productId.productName} */}
                          </h4>
                          <p>
                            <span className="line-through text-gray-200 mr-1">
                              Rs. {product.originalPrice}
                            </span>
                            <span className="text-yellow-300 font-bold">
                              Rs. {product.salePrice}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm italic opacity-70">
                    No products added to this sale yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <CreateSaleModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
        {selectedSale && (
          <DeleteSaleModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            sale={selectedSale}
          />
        )}
        {selectedSale && (
          <UpdateSaleModal
            isOpen={updateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            sale={selectedSale}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
