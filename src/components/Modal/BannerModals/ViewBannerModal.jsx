'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { ClipLoader } from 'react-spinners'
import { useGetSingleOrder } from '@/app/api/orderApi'

export default function ViewOrderModal({ orderId, onClose, showViewModal }) {
  const { data: order, isLoading, error } = useGetSingleOrder(orderId)
  console.log(order.status)

  return (
    <Dialog open={showViewModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader />
          </div>
        ) : error ? (
          <p className="p-4 text-red-500">Failed to load order</p>
        ) : (
          <div className="flex flex-col w-full h-full overflow-auto p-4 space-y-6">
            {/* Order Header */}
            <h2 className="text-2xl font-bold text-center">
              Order #{order?._id}
            </h2>
            <p className="text-center text-gray-600">
              Placed on {new Date(order?.createdAt).toLocaleDateString()}
            </p>

            {/* Customer Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Customer</h3>
              <p>
                <strong>Name:</strong> {order?.customer?.name}
              </p>
              <p>
                <strong>Phone:</strong> {order?.customer?.phone}
              </p>
              <p>
                <strong>Address:</strong> {order?.customer?.address?.line1},{' '}
                {order?.customer?.address?.city}
              </p>
            </div>

            {/* Products */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Products</h3>
              <div className="space-y-3">
                {order?.items?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-b pb-2"
                  >
                    <img
                      src={item.productId?.imageUrl}
                      alt={item.productId?.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.productId?.productName}
                      </span>
                      <span className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-sm text-gray-600">
                        Price: ${item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Summary</h3>
              <p>
                <strong>Status:</strong> {order?.status}
              </p>
              <p>
                <strong>Total:</strong> ${order?.total}
              </p>
            </div>

            <Button
              onClick={onClose}
              type="button"
              variant="outline"
              className="mt-4"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
