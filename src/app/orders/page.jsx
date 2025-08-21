'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useGetAllOrders } from '@/app/api/orderApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import { Edit, Eye, Trash2 } from 'lucide-react'
import EditOrderModal from '@/components/Modal/OrdersModel/EditOrderModal'
import DeleteOrderModal from '@/components/Modal/OrdersModel/DeleteOrderModel'
import ViewOrderModal from '@/components/Modal/OrdersModel/ViewOrderModal'
import { OrderSkeletonRow } from '@/components/ui/common/Skeleton'

// Import your modals

const statusColors = {
  complete: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  delivered: 'bg-blue-100 text-blue-700',
  shifted: 'bg-purple-100 text-purple-700',
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useGetAllOrders()
  const [tab, setTab] = useState('all')

  // state for modals
  // state for modals
  const [activeModal, setActiveModal] = useState(null)

  // Filter orders based on tab
  const filteredOrders =
    tab === 'all' ? orders : orders.filter((o) => o.status === tab)

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Orders</h1>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 flex gap-5">
            <TabsTrigger value="all">All orders</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="shifted">Shifted</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={tab}>
            <div className="border rounded-lg overflow-hidden bg-background  text-foreground shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50 text-background">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Products</th>
                    <th className="p-3 text-left">Address</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? [...Array(6)].map((_, i) => <OrderSkeletonRow key={i} />)
                    : filteredOrders.map((order, i) => (
                        <tr
                          key={order._id}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          <td className="p-3 text-foreground">{i + 1}</td>
                          <td className="p-3 font-medium text-foreground">
                            #{order._id}
                          </td>
                          <td className="p-3">
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center gap-2"
                              >
                                <img
                                  src={item.productId.imageUrl}
                                  alt={item.productId.productName}
                                  className="w-8 h-8 rounded"
                                />
                                <span>
                                  {item.productId.productName} (x{item.quantity}
                                  )
                                </span>
                              </div>
                            ))}
                          </td>
                          <td className="p-3 text-foreground">
                            {order.customer.address.line1}
                          </td>
                          <td className="p-3">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-foreground">
                            ${order.total}
                          </td>
                          <td className="p-3 text-foreground">
                            <Badge
                              className={
                                statusColors[order.status] ||
                                'bg-gray-100 text-background'
                              }
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3 text-foreground flex gap-3">
                            <Eye
                              className="cursor-pointer"
                              onClick={() =>
                                setActiveModal({
                                  type: 'view',
                                  orderId: order._id,
                                })
                              }
                            />
                            <Edit
                              className="cursor-pointer"
                              onClick={() =>
                                setActiveModal({
                                  type: 'edit',
                                  orderId: order._id,
                                })
                              }
                            />
                            <Trash2
                              className="cursor-pointer"
                              onClick={() =>
                                setActiveModal({
                                  type: 'delete',
                                  orderId: order._id,
                                })
                              }
                            />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-500">
                  Showing 1 to 10 of {orders.length} entries
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={num === 1 ? 'default' : 'outline'}
                      size="sm"
                    >
                      {num}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== Modals ===== */}
      {activeModal?.type === 'view' && (
        <ViewOrderModal
          orderId={activeModal.orderId}
          onClose={() => setActiveModal(null)}
          showViewModal={activeModal?.type === 'view'}
        />
      )}
      {activeModal?.type === 'edit' && (
        <EditOrderModal
          orderId={activeModal.orderId}
          onClose={() => setActiveModal(null)}
          showEditModal={activeModal?.type === 'edit'}
        />
      )}
      {activeModal?.type === 'delete' && (
        <DeleteOrderModal
          orderId={activeModal.orderId}
          onClose={() => setActiveModal(null)}
          order={orders}
          showDeleteModal={activeModal?.type === 'delete'}
        />
      )}
    </DashboardLayout>
  )
}
