'use client'

import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  useCancelOrder,
  useBulkUpdateOrderStatus,
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
import { toast } from 'react-toastify'

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
  const { data: orderstat } = useGetOrderStats()
  const orderStats = orderstat?.data
  const cancelOrderMutation = useCancelOrder()
  const bulkStatusMutation = useUpdateOrderStatus()

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


  // Selection state for bulk actions
  const [selectedOrders, setSelectedOrders] = useState([])
  const idsOnPage = useMemo(() => orders.map((o) => o._id), [orders])
  const allSelected =
    idsOnPage.length > 0 && idsOnPage.every((id) => selectedOrders.includes(id))
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedOrders((prev) => prev.filter((id) => !idsOnPage.includes(id)))
    } else {
      setSelectedOrders((prev) => Array.from(new Set([...prev, ...idsOnPage])))
    }
  }
  const toggleOne = (id) =>
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  // Bulk actions UI state and handlers
  const [bulkAction, setBulkAction] = useState('')

  const exportSelectedCSV = () => {
    if (!selectedOrders.length) return
    const selected = orders.filter((o) => selectedOrders.includes(o._id))
    if (!selected.length) return
    const headers = [
      'OrderID',
      'Date',
      'Status',
      'Total',
      'CustomerName',
      'Email',
      'Phone',
    ]
    const rows = selected.map((o) => [
      o.orderId,
      new Date(o.createdAt).toLocaleString(),
      o.status,
      o.totalAmount,
      o.billingAddress?.name || '',
      o.billingAddress?.email || '',
      o.billingAddress?.phone || '',
    ])
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')
      )
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportSelectedXLSX = () => {
    if (!selectedOrders.length) return
    const selected = orders.filter((o) => selectedOrders.includes(o._id))
    if (!selected.length) return
    const headers = [
      'OrderID',
      'Date',
      'Status',
      'Total',
      'CustomerName',
      'Email',
      'Phone',
    ]
    const rows = selected.map((o) => [
      o.orderId,
      new Date(o.createdAt).toLocaleString(),
      o.status,
      o.totalAmount,
      o.billingAddress?.name || '',
      o.billingAddress?.email || '',
      o.billingAddress?.phone || '',
    ])
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')
      )
      .join('\n')
    const blob = new Blob([csv], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${Date.now()}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const applyBulk = async () => {
    if (!selectedOrders.length) return

    try {
      // Handle local-only actions
      if (bulkAction === 'export') {
        exportSelectedCSV()
        return
      }
      if (bulkAction === 'export_xlsx') {
        exportSelectedXLSX()
        return
      }

      // Handle cancel (different API)
      if (bulkAction === 'cancelled') {
        const results = await Promise.all(
          selectedOrders.map(async (_id) => {
            const order = orders.find((o) => o._id === _id)
            try {
              const res = await cancelOrderMutation.mutateAsync({
                orderId: order?.orderId,
                reason: 'Cancelled by admin',
              })
              setSelectedOrders([])
              setBulkAction('')
              toast.success(res?.message || 'Orders Cancelled Successfully')
            } catch (err) {
              toast.error(
                typeof err === 'string' ? err : 'Failed to cancel order'
              )
            }
          })
        )
      }

      // Map your frontend bulk actions → API statuses
      const map = {
        processing: 'processing',
        on_hold: 'pending',
        completed: 'complete',
        slip_generated: 'pending',
        packed: 'packed',
        confirmed: 'delivered',
        shipped: 'shipped',
        pending: 'pending',
      }

      const nextStatus = map[bulkAction]
      if (!nextStatus) return
      // Call your update status API for each selected order
      const res = await Promise.all(
        selectedOrders.map((_id) => {
          const order = orders.find((o) => o._id === _id)
          return bulkStatusMutation.mutateAsync({
            orderId: order?.orderId,
            status: nextStatus,
          })
        })
      )
      toast.success(res?.message || 'Status Updated Successfully')
      setSelectedOrders([])
      setBulkAction('')
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Something Went Wrong')
    }
  }

  const updateURL = (filters) => {
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== '' && value != null
      )
    )
    if (!nonEmptyFilters.sort) {
      nonEmptyFilters.sort = 'createdAt:desc'
    }
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
        <div className="flex items-center gap-2 border-b pb-4 mb-4 text-sm">
          {/* All orders */}
          <div
            onClick={() => updateURL({})}
            className="cursor-pointer pr-3 border-r last:border-r-0"
          >
            <span className="hover:text-blue-600">All</span>
            <span className="ml-1 text-gray-500">
              ({orderStats?.totalOrders || 0})
            </span>
          </div>

          {/* Other statuses */}
          {orderStats?.statusBreakdown?.map((stat, i) => (
            <div
              key={i}
              onClick={() => updateURL({ status: stat.status })}
              className="cursor-pointer px-3 border-r last:border-r-0"
            >
              <span
                className={`hover:text-blue-600 ${
                  filtersFromURL.status === stat.status
                    ? 'font-semibold text-blue-600'
                    : ''
                }`}
              >
                {stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}
              </span>
              <span className="ml-1 text-gray-500">({stat.count})</span>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-3 mb-3">
          <select
            className="border rounded p-2 text-sm min-w-52 bg-background"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            disabled={!selectedOrders.length}
          >
            <option value="">Bulk actions</option>
            <option value="export">Export as CSV</option>
            <option value="export_xlsx">Export as XLSX</option>
            <option value="mark_exported">Mark exported</option>
            <option value="unmark_exported">Unmark exported</option>
            <option value="processing">Change status to processing</option>
            <option value="on_hold">Change status to on-hold</option>
            <option value="completed">Change status to completed</option>
            <option value="cancelled">Change status to cancelled</option>
            <option value="trash">Move to Trash</option>
            <option value="slip_generated">
              Change status to Slip Generated
            </option>
            <option value="packed">Change status to Packed</option>
            <option value="confirmed">Change status to Confirmed</option>
            <option value="shipped">Change status to Shipped</option>
          </select>
          <Button
            onClick={applyBulk}
            disabled={!selectedOrders.length || (!bulkAction && true)}
          >
            Apply
          </Button>
          {bulkStatusMutation.isPending && (
            <span className="text-xs text-gray-500">Applying...</span>
          )}
        </div>

        {/* Orders Table */}
        <div className="border rounded-lg overflow-hidden bg-background text-foreground shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-background text-foreground">
              <tr>
                <th className="p-3 text-left w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 text-left">S.No#</th>
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
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleOne(order._id)}
                        />
                      </td>
                      <td className="p-3 font-medium">
                        {(orderStats?.totalOrders || 0) -
                          ((page - 1) * (filtersFromURL.limit || 10) + i)}
                      </td>

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
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                      </td>
                      {/* Total */}
                      <td className="p-3">Rs.{order.totalAmount.toFixed(2)}</td>

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
