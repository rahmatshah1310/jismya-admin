'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useGetSingleOrder, useUpdateOrderStatus } from '@/app/api/orderApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import { OrderSkeletonRow } from '@/components/ui/common/Skeleton'
import DeleteOrderModal from '@/components/Modal/OrdersModel/DeleteOrderModel'
import BillingAddress from '@/components/ordersbillingshipping/BillingAddress'
import ShippingAddress from '@/components/ordersbillingshipping/ShippingAddress'
import { toast } from 'react-toastify'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  slip_generated: 'bg-blue-100 text-blue-700',
  shifted: 'bg-purple-100 text-purple-700',
  delivered: 'bg-indigo-100 text-indigo-700',
  complete: 'bg-teal-100 text-teal-700',
  cancelled: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  onhold: 'bg-gray-100 text-gray-700',
  trash: 'bg-gray-200 text-gray-800',
}

export default function OrderDetailsPage() {
  const { id: orderId } = useParams()
  const router = useRouter()

  const { data, isLoading, error } = useGetSingleOrder(orderId)
  const order = data?.data
  const updateStatusMutation = useUpdateOrderStatus()

  const [activeModal, setActiveModal] = useState(null)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="border rounded-lg overflow-hidden bg-background text-foreground shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-background">
                <tr>
                  <th className="p-3 text-left">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, i) => (
                  <OrderSkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground">
              Order not found
            </h2>
            <p className="text-gray-500 mt-2">
              The order you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push('/orders')} className="mt-4">
              Back to Orders
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/orders')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
            <h1 className="text-2xl font-semibold">Order #{order.orderId}</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() =>
                setActiveModal({ type: 'delete', orderId: order._id })
              }
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Order
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
          <div className="xl:col-span-2 flex gap-4">
            <div className="w-[40%]">
              <h2 className="text-xl font-semibold">General</h2>
              <div className="mt-2 w-full">
                <h3 className="text-lg font-semibold ">Status</h3>
                <div className="flex items-center gap-4">
                  <select
                    className="border p-2 rounded-md text-sm bg-transparent !w-full"
                    value={order.status}
                    onChange={async (e) => {
                      try {
                        const res = await updateStatusMutation.mutateAsync({
                          orderId: order.orderId,
                          status: e.target.value,
                        })

                        toast.success(
                          res?.message || 'Order status updated successfully!'
                        )
                      } catch (error) {
                        console.error('Update order status error:', error)
                        toast.error(
                          typeof error === 'string'
                            ? error
                            : 'Something went wrong while updating status.'
                        )
                      }
                    }}
                  >
                    <option value="pending" className="bg-background">
                      Pending
                    </option>
                    <option value="confirmed" className="bg-background">
                      Confirmed
                    </option>
                    <option value="slip_generated" className="bg-background">
                      Slip Generated
                    </option>
                    <option value="shipped" className="bg-background">
                      Shipped
                    </option>
                    <option value="delivered" className="bg-background">
                      Delivered
                    </option>
                    <option value="complete" className="bg-background">
                      Complete
                    </option>
                    <option value="cancelled" className="bg-background">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {/* Order Status Update Section */}

            <BillingAddress order={order} />
            <ShippingAddress order={order} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Customer Statistics */}
            <div className="bg-background text-foreground p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Customer Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground mb-2">
                      Date Created
                    </span>
                  </div>
                  <span className="font-semibold text-lg">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground mb-2">
                      Total Amount
                    </h3>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {order.estimatedDelivery && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Estimated Delivery
                      </label>
                      <p className="text-foreground">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-background text-foreground p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Order Actions</h3>
              <div className="space-y-3">
                <select className="w-full p-2 border rounded-md text-sm">
                  <option>Choose an action...</option>
                  <option>Mark as completed</option>
                  <option>Mark as shipped</option>
                  <option>Cancel order</option>
                </select>
                <Button variant="destructive" className="w-full">
                  Move to Trash
                </Button>
              </div>
            </div>

            {/* Order Attribution */}
            <div className="bg-background text-foreground p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Order Attribution</h3>
              <div className="flex items-center gap-x-5">
                {' '}
                <div>
                  <h3 className="font-medium">Order Status</h3>
                  <Badge
                    className={statusColors[order.status] || 'text-background'}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  {' '}
                  <h3 className="font-medium text-foreground">
                    Payment Status
                  </h3>
                  <Badge
                    className={
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Shipping Method
                  </label>
                  <p className="text-foreground capitalize">
                    {order.shippingMethod}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-background text-foreground p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold">Order Notes</h3>
              <div>
                <p className="text-foreground">
                  {order.notes || 'No notes provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-background text-foreground p-6 rounded-lg border shadow-sm mt-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={item.productId?.imageUrl}
                  alt={item.productId?.productName}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.productId?.productName}</h4>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ${item.productId?.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.totalPrice?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Details */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Truck className="w-4 h-4" />
              <span>Free shipping</span>
            </div>
            <div className="text-sm text-gray-600">
              Items:{' '}
              {order.items
                ?.map(
                  (item) => `${item.productId?.productName} x ${item.quantity}`
                )
                .join(', ')}
            </div>
            <div className="text-sm text-gray-600">
              <span>Total: ${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal Only */}
      {activeModal?.type === 'delete' && (
        <DeleteOrderModal
          orderId={activeModal.orderId}
          onClose={() => setActiveModal(null)}
          order={order}
          showDeleteModal={true}
        />
      )}
    </DashboardLayout>
  )
}
