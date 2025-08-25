'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useGetSingleOrder } from '@/app/api/orderApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { OrderSkeletonRow } from '@/components/ui/common/Skeleton'
import DeleteOrderModal from '@/components/Modal/OrdersModel/DeleteOrderModel'
import BillingAddress from '@/components/ordersbillingshipping/BillingAddress'
import ShippingAddress from '@/components/ordersbillingshipping/ShippingAddress'

// 👇 import the new modals
import EditBillingModal from '@/components/Modal/OrdersModel/EditBillingModal'
import EditShippingModal from '@/components/Modal/OrdersModel/EditShippingModal'

const statusColors = {
  complete: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  delivered: 'bg-blue-100 text-blue-700',
  shifted: 'bg-purple-100 text-purple-700',
}

export default function OrderDetailsPage() {
  const { id: orderId } = useParams()
  const router = useRouter()

  const { data, isLoading, error } = useGetSingleOrder(orderId)
  const order = data?.data

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
            {/* 👇 separate edit buttons for Billing & Shipping */}
            <Button
              onClick={() =>
                setActiveModal({ type: 'editBilling', orderId: order._id })
              }
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Billing
            </Button>
            <Button
              onClick={() =>
                setActiveModal({ type: 'editShipping', orderId: order._id })
              }
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Shipping
            </Button>
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

        {/* Order Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background text-foreground p-4 rounded-lg border shadow-sm">
            <h3 className="font-medium text-foreground mb-2">Order Status</h3>
            <Badge
              className={
                statusColors[order.status] || 'bg-gray-100 text-foreground'
              }
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          <div className="bg-background text-foreground p-4 rounded-lg border shadow-sm">
            <h3 className="font-medium text-foreground mb-2">Payment Status</h3>
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

          <div className="bg-background text-foreground p-4 rounded-lg border shadow-sm">
            <h3 className="font-medium text-foreground mb-2">Total Amount</h3>
            <p className="text-2xl font-bold text-green-600">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <BillingAddress order={order} />
        <ShippingAddress order={order} />

        {/* Order Items */}
        <div className="bg-background text-foreground p-6 rounded-lg border shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.productName}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.productId.productName}</h4>
                  <p className="text-sm text-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-foreground">
                    Price: ${item.productId.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-background text-foreground p-6 rounded-lg border shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Order ID
              </label>
              <p className="text-foreground font-mono">{order.orderId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Order Date
              </label>
              <p className="text-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Shipping Method
              </label>
              <p className="text-foreground capitalize">
                {order.shippingMethod}
              </p>
            </div>
            {order.estimatedDelivery && (
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Estimated Delivery
                </label>
                <p className="text-foreground">
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground">
                Notes
              </label>
              <p className="text-foreground">
                {order.notes || 'No notes provided'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal?.type === 'editBilling' && (
        <EditBillingModal
          orderData={order}
          showModal={true}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal?.type === 'editShipping' && (
        <EditShippingModal
          orderData={order}
          showModal={true}
          onClose={() => setActiveModal(null)}
        />
      )}

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
