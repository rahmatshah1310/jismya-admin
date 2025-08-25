'use client'

import { useUpdateOrder } from '@/app/api/orderApi'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

export default function EditBillingModal({ showModal, onClose, orderData }) {
  const [billing, setBilling] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    completeAddress: '',
  })

  const updateOrderMutation = useUpdateOrder()

  useEffect(() => {
    if (orderData) {
      setBilling({
        name: orderData.billingAddress?.name || '',
        email: orderData.billingAddress?.email || '',
        phone: orderData.billingAddress?.phone || '',
        country: orderData.billingAddress?.country || '',
        city: orderData.billingAddress?.city || '',
        completeAddress: orderData.billingAddress?.completeAddress || '',
      })
    }
  }, [orderData])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateOrderMutation.mutate(
      { id: orderData._id, data: { billingAddress: billing } },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Edit Billing Address</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'phone', 'country', 'city', 'completeAddress'].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm mb-1">
                  {field
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <Input
                  value={billing[field]}
                  onChange={(e) =>
                    setBilling({ ...billing, [field]: e.target.value })
                  }
                />
              </div>
            )
          )}

          <button
            type="submit"
            disabled={updateOrderMutation.isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {updateOrderMutation.isPending ? 'Updating...' : 'Update Billing'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
