'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  useCancelOrder,
  useGetAllOrders,
  useGetOrderStats,
  useUpdateOrderStatus,
} from '@/app/api/orderApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Edit, Eye, Trash2 } from 'lucide-react'
import DeleteOrderModal from '@/components/Modal/OrdersModel/DeleteOrderModel'
import { OrderSkeletonRow } from '@/components/ui/common/Skeleton'
import OrderFilters from '@/components/OrderFilter'
import { useRouter, useSearchParams } from 'next/navigation'

const statusColors = {
  complete: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-blue-100 text-blue-700',
  shifted: 'bg-purple-100 text-purple-700',
}
export const dynamic = 'force-dynamic'

export default function OrdersClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeModal, setActiveModal] = useState(null)
  const updateStatusMutation = useUpdateOrderStatus()
  const { data: orderstat } = useGetOrderStats()
  const orderStats = orderstat?.data;
  console.log(orderStats, "orderstat............")
  const cancelOrderMutation = useCancelOrder()

  // Extract filters from URL
  const filtersFromURL = Object.fromEntries(
    [...searchParams.entries()].filter(([_, value]) => value !== '')
  )

  // Convert page & limit to numbers
  if (filtersFromURL.page) filtersFromURL.page = Number(filtersFromURL.page)
  if (filtersFromURL.limit) filtersFromURL.limit = Number(filtersFromURL.limit)

  const { data, isLoading } = useGetAllOrders(filtersFromURL)

  const orders = data?.data?.orders || []
  const totalPages = data?.data?.total || 1
  const page = filtersFromURL.page || 1

  const updateURL = (filters) => {
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== '' && value != null
      )
    )
    const url = Object.keys(nonEmptyFilters).length
      ? `/orders?${new URLSearchParams(nonEmptyFilters)}`
      : '/orders'
    router.push(url)
  }

  const handlePageChange = (newPage) =>
    updateURL({ ...filtersFromURL, page: newPage })
  const handleFilter = (newFilters) => updateURL({ ...newFilters, page: 1 })

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Orders</h1>

        {/* Filters */}
        <OrderFilters onFilter={handleFilter} currentFilters={filtersFromURL} />
      <div className="flex gap-x-4 pb-4">
          {orderStats?.statusBreakdown?.map((stat, i) => (
            <div key={i} className={`${i % 2 === 0 ? 'bg-muted/40' : 'bg-muted/30'} border-t`}>
              <span >{stat.status}</span>
              <span >({stat.count})</span>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="border rounded-lg overflow-hidden bg-background text-foreground shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-background text-foreground">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(6)].map((_, i) => <OrderSkeletonRow key={i} />)
                : orders.map((order, i) => (
                  <tr key={order._id} className="border-t transition">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-medium">#{order.orderId}</td>

                    {/* Date */}
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                      {order.estimatedDelivery && (
                        <div className="text-xs text-gray-500">
                          ETA:{' '}
                          {new Date(
                            order.estimatedDelivery
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* Payment */}
                    <td className="p-3 relative">
                      <div className="relative inline-block">
                        <Badge
                          className={
                            statusColors[order.status] ||
                            'bg-gray-100 text-background'
                          }
                          onClick={() =>
                            setActiveModal({
                              type: 'status',
                              orderId: order._id,
                            })
                          }
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>

                        {/* Dropdown for status update (except cancelled) */}
                        {activeModal?.type === 'status' &&
                          activeModal.orderId === order._id && (
                            <div className="absolute z-10 mt-1 bg-background border rounded shadow w-max">
                              {[
                                'pending',
                                'shifted',
                                'delivered',
                                'complete',
                              ].map((s) => (
                                <div
                                  key={s}
                                  className="px-4 py-2 cursor-pointer"
                                  onClick={() => {
                                    updateStatusMutation.mutate(
                                      { id: order._id, status: s },
                                      {
                                        onSuccess: () => setActiveModal(null),
                                      }
                                    )
                                  }}
                                >
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </td>
                    {/* Total */}
                    <td className="p-3">${order.totalAmount.toFixed(2)}</td>

                    {/* Actions */}

                    <td className="p-3 flex gap-3 mt-6">
                      <Eye
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/orders/${order.orderId}`)
                        }
                      />
                      <Trash2
                        className="cursor-pointer text-red-500"
                        onClick={() =>
                          setActiveModal({
                            type: 'cancel',
                            orderId: order._id,
                          })
                        }
                      />
                    </td>

                    {/* Cancel Modal */}
                    {activeModal?.type === 'cancel' &&
                      activeModal.orderId === order._id && (
                        <DeleteOrderModal
                          orderId={activeModal.orderId}
                          onClose={() => setActiveModal(null)}
                          showDeleteModal
                        />
                      )}
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-500">
              Showing page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
