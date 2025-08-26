'use client'

import { useUpdateBillingAddress } from '@/app/api/orderApi'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function EditBillingModal({ showModal, onClose, orderData }) {
  const [billing, setBilling] = useState({
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

  const updateOrderMutation = useUpdateBillingAddress()

  useEffect(() => {
    if (orderData?.billingAddress) {
      setBilling({
        name: orderData.billingAddress.name || '',
        email: orderData.billingAddress.email || '',
        phone: orderData.billingAddress.phone || '',
        country: orderData.billingAddress.country || '',
        city: orderData.billingAddress.city || '',
        completeAddress: orderData.billingAddress.completeAddress || '',
        company: orderData.billingAddress.company || '',
        addressLine2: orderData.billingAddress.addressLine2 || '',
        postcode: orderData.billingAddress.postcode || '',
        state: orderData.billingAddress.state || '',
      })
    } else {
      setBilling({
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
        billingAddress: billing,
      })
      toast.success(res?.message || 'Billing address updated successfully!')
      onClose()
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle>Edit Billing Address</DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <Input
                value={billing.name?.split(' ')[0] || ''}
                onChange={(e) => {
                  const lastName = billing.name?.split(' ').slice(1).join(' ') || ''
                  setBilling({ ...billing, name: `${e.target.value} ${lastName}`.trim() })
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <Input
                value={billing.name?.split(' ').slice(1).join(' ') || ''}
                onChange={(e) => {
                  const firstName = billing.name?.split(' ')[0] || ''
                  setBilling({ ...billing, name: `${firstName} ${e.target.value}`.trim() })
                }}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm mb-1">Company</label>
              <Input
                value={billing.company}
                onChange={(e) => setBilling({ ...billing, company: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                type="email"
                value={billing.email}
                onChange={(e) => setBilling({ ...billing, email: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <Input
                value={billing.phone}
                onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm mb-1">Country / Region</label>
              <Input
                value={billing.country}
                onChange={(e) => setBilling({ ...billing, country: e.target.value })}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm mb-1">City</label>
              <Input
                value={billing.city}
                onChange={(e) => setBilling({ ...billing, city: e.target.value })}
              />
            </div>

            {/* Postcode */}
            <div>
              <label className="block text-sm mb-1">Postcode / ZIP</label>
              <Input
                value={billing.postcode}
                onChange={(e) => setBilling({ ...billing, postcode: e.target.value })}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm mb-1">State / County</label>
              <Input
                value={billing.state}
                onChange={(e) => setBilling({ ...billing, state: e.target.value })}
              />
            </div>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm mb-1">Address Line 1</label>
            <Input
              value={billing.completeAddress}
              onChange={(e) => setBilling({ ...billing, completeAddress: e.target.value })}
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm mb-1">Address Line 2</label>
            <Input
              value={billing.addressLine2}
              onChange={(e) => setBilling({ ...billing, addressLine2: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={updateOrderMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {updateOrderMutation.isPending ? 'Updating...' : 'Update Billing Address'}
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
