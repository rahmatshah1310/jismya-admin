'use client'

import { useUpdateShippingAddress } from '@/app/api/orderApi'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function EditShippingModal({ showModal, onClose, orderData }) {
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    completeAddress: '',
  })

  const updateOrderMutation = useUpdateShippingAddress()

  useEffect(() => {
    if (orderData?.shippingAddress) {
      setShipping({
        name: orderData.shippingAddress.name || '',
        email: orderData.shippingAddress.email || '',
        phone: orderData.shippingAddress.phone || '',
        country: orderData.shippingAddress.country || '',
        city: orderData.shippingAddress.city || '',
        completeAddress: orderData.shippingAddress.completeAddress || '',
      })
    } else {
      setShipping({
        name: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        completeAddress: '',
      })
    }
  }, [orderData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await updateOrderMutation.mutateAsync({
        orderId: orderData.orderId, // use _id instead of orderId if backend expects MongoDB id
        shippingAddress: shipping,
      })
      toast.success(res?.message || 'Order updated successfully!')
      onClose()
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Edit Shipping Address</DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <Input
              value={shipping.name}
              onChange={(e) =>
                setShipping({ ...shipping, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              type="email"
              value={shipping.email}
              onChange={(e) =>
                setShipping({ ...shipping, email: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <Input
              value={shipping.phone}
              onChange={(e) =>
                setShipping({ ...shipping, phone: e.target.value })
              }
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm mb-1">Country</label>
            <Input
              value={shipping.country}
              onChange={(e) =>
                setShipping({ ...shipping, country: e.target.value })
              }
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm mb-1">City</label>
            <Input
              value={shipping.city}
              onChange={(e) =>
                setShipping({ ...shipping, city: e.target.value })
              }
            />
          </div>

          {/* Complete Address */}
          <div>
            <label className="block text-sm mb-1">Complete Address</label>
            <Input
              value={shipping.completeAddress}
              onChange={(e) =>
                setShipping({ ...shipping, completeAddress: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={updateOrderMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {updateOrderMutation.isPending ? 'Updating...' : 'Update Shipping'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
