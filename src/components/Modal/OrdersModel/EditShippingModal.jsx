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
    company: '',
    addressLine2: '',
    postcode: '',
    state: '',
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
        company: orderData.shippingAddress.company || '',
        addressLine2: orderData.shippingAddress.addressLine2 || '',
        postcode: orderData.shippingAddress.postcode || '',
        state: orderData.shippingAddress.state || '',
      })
    } else {
      setShipping({
        name: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        completeAddress: '',
        company: '',
        addressLine2: '',
        postcode: '',
        state: '',
      })
    }
  }, [orderData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await updateOrderMutation.mutateAsync({
        orderId: orderData._id, // Use _id from the order object
        shippingAddress: shipping,
      })
      toast.success(res?.message || 'Shipping address updated successfully!')
      onClose()
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle>Edit Shipping Address</DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <Input
                value={shipping.name?.split(' ')[0] || ''}
                onChange={(e) => {
                  const lastName = shipping.name?.split(' ').slice(1).join(' ') || ''
                  setShipping({ ...shipping, name: `${e.target.value} ${lastName}`.trim() })
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <Input
                value={shipping.name?.split(' ').slice(1).join(' ') || ''}
                onChange={(e) => {
                  const firstName = shipping.name?.split(' ')[0] || ''
                  setShipping({ ...shipping, name: `${firstName} ${e.target.value}`.trim() })
                }}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm mb-1">Company</label>
              <Input
                value={shipping.company}
                onChange={(e) => setShipping({ ...shipping, company: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                type="email"
                value={shipping.email}
                onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <Input
                value={shipping.phone}
                onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm mb-1">Country / Region</label>
              <Input
                value={shipping.country}
                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm mb-1">City</label>
              <Input
                value={shipping.city}
                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
              />
            </div>

            {/* Postcode */}
            <div>
              <label className="block text-sm mb-1">Postcode / ZIP</label>
              <Input
                value={shipping.postcode}
                onChange={(e) => setShipping({ ...shipping, postcode: e.target.value })}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm mb-1">State / County</label>
              <Input
                value={shipping.state}
                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
              />
            </div>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm mb-1">Address Line 1</label>
            <Input
              value={shipping.completeAddress}
              onChange={(e) => setShipping({ ...shipping, completeAddress: e.target.value })}
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm mb-1">Address Line 2</label>
            <Input
              value={shipping.addressLine2}
              onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={updateOrderMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {updateOrderMutation.isPending ? 'Updating...' : 'Update Shipping Address'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
