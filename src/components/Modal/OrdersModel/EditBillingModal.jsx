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
  })

  const updateOrderMutation = useUpdateBillingAddress()

  useEffect(() => {
    if (orderData?.billingAddress) {
      setBilling({
        name: orderData.billingAddress.name,
        email: orderData.billingAddress.email,
        phone: orderData.billingAddress.phone,
        country: orderData.billingAddress.country,
        city: orderData.billingAddress.city,
        completeAddress: orderData.billingAddress.completeAddress,
      })
    } else {
      setBilling({
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
        orderId: orderData.orderId,
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
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Edit Billing Address</DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <Input
              value={billing.name}
              onChange={(e) => setBilling({ ...billing, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              type="email"
              value={billing.email}
              onChange={(e) =>
                setBilling({ ...billing, email: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <Input
              value={billing.phone}
              onChange={(e) =>
                setBilling({ ...billing, phone: e.target.value })
              }
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm mb-1">Country</label>
            <Input
              value={billing.country}
              onChange={(e) =>
                setBilling({ ...billing, country: e.target.value })
              }
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

          {/* Complete Address */}
          <div>
            <label className="block text-sm mb-1">Complete Address</label>
            <Input
              value={billing.completeAddress}
              onChange={(e) =>
                setBilling({ ...billing, completeAddress: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={updateOrderMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {updateOrderMutation.isPending ? 'Updating...' : 'Update Billing'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
